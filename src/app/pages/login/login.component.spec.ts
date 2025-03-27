import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on valid form', () => {
    authServiceMock.login.and.returnValue(of({ token: 'mock-token' })); // Add token property
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalled();
  });

  it('should set error on login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('Failed')));
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    component.onSubmit();
    expect(component.error()).toBe('Failed');
  });
});