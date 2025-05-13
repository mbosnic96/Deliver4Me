import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login if form is invalid', () => {
    component.form.setValue({ email: 'invalid-email', password: '' });
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with form values', () => {
    const testCredentials = { email: 'test@test.com', password: 'password' };
    authService.login.and.callFake((email: string, password: string) => of({ token: 'mock-token', user: {} }));
    
    component.form.setValue(testCredentials);
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith(
      testCredentials.email, 
      testCredentials.password
    );
  });

  

  it('should navigate to dashboard on successful login', () => {
    authService.login.and.returnValue(of({ token: 'mock-token', user: {} }));
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set loading to false after successful login', () => {
    authService.login.and.returnValue(of({ token: 'mock-token', user: {} }));
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
    expect(component.loading).toBeFalse();
  });

  it('should handle 401 unauthorized error', () => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: { message: 'Invalid credentials' }
    });
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.form.setValue({ email: 'test@test.com', password: 'wrong' });
    component.onSubmit();
    
    expect(component.error).toBe('Invalid email or password');
    expect(component.loading).toBeFalse();
  });

  it('should handle server errors (500)', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: { message: 'Server error' }
    });
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
    
    expect(component.error).toBe('Login failed. Please try again later.');
    expect(component.loading).toBeFalse();
  });

  it('should reset form after successful login', () => {
    authService.login.and.returnValue(of({ token: 'mock-token', user: {} }));
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
  
    expect(component.form.value).toEqual({ email: '', password: '' });
    expect(component.form.pristine).toBeTrue();
  });
  

  it('should handle network error (status 0)', () => {
    const errorResponse = new HttpErrorResponse({
      status: 0,
      error: new ProgressEvent('error')
    });
    authService.login.and.returnValue(throwError(() => errorResponse));
  
    component.form.setValue({ email: 'test@test.com', password: 'any' });
    component.onSubmit();
  
    expect(component.error).toContain('Please check your connection');
  });
  
});