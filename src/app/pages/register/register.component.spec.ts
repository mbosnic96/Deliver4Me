import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.form.patchValue({ email: '', password: '' });
    component.onSubmit();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should validate password confirmation mismatch', () => {
    component.form.patchValue({
      password: '123456',
      confirmPassword: '654321'
    });
    expect(component.form.errors?.['mismatch']).toBeTrue();
  });

  it('should submit valid normal user registration', () => {
    const validData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '123456789',
      address: 'Test Address',
      password: '123456',
      confirmPassword: '123456',
      isDeliveryMan: false,
      vehicleTypes: {
        van: false, truck: false, longTruck: false, sandTruck: false, junkTruck: false
      }
    };
    component.form.setValue(validData);
    authService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.onSubmit();
    expect(authService.register).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
      isDeliveryMan: false
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });



  it('should handle 400+ error response', () => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: { message: 'Validation failed' }
    });
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.form.patchValue({
      name: 'John', username: 'john123', email: 'john@example.com',
      phone: '123456789', address: 'Street 1', password: '123456', confirmPassword: '123456',
      isDeliveryMan: false, vehicleTypes: {}
    });

    component.onSubmit();
    expect(component.error()).toBe('Validation failed');
    expect(component.loading()).toBeFalse();
  });

  it('should show fallback message if server error has no message', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: {}
    });
  
    authService.register.and.returnValue(throwError(() => errorResponse));
  
    component.form.patchValue({
      name: 'Jane', username: 'jane123', email: 'jane@example.com',
      phone: '987654321', address: 'Main Street', password: 'abcdef', confirmPassword: 'abcdef',
      isDeliveryMan: false, vehicleTypes: {}
    });
  
    component.onSubmit();
  
    expect(component.error()).toBe('An unexpected error occurred. Please try again later.');
    expect(component.loading()).toBeFalse();
  });
  

  it('should handle server error 500', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      error: { message: 'Server Error' }
    });
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.form.patchValue({
      name: 'John', username: 'john123', email: 'john@example.com',
      phone: '123456789', address: 'Street 1', password: '123456', confirmPassword: '123456',
      isDeliveryMan: false, vehicleTypes: {}
    });

    component.onSubmit();
    expect(component.error()).toBe('An unexpected error occurred. Please try again later.');
  });

  it('should reset form on success', () => {
    authService.register.and.returnValue(of({ message: 'Success' }));
    component.form.patchValue({
      name: 'John', username: 'john123', email: 'john@example.com',
      phone: '123456789', address: 'Street 1', password: '123456', confirmPassword: '123456',
      isDeliveryMan: false, vehicleTypes: {}
    });

    component.onSubmit();
    expect(component.form.pristine).toBeTrue();
    expect(component.form.value.name).toBe('');
  });

  it('should handle network errors', () => {
    const errorResponse = new HttpErrorResponse({
      status: 0,
      error: new ProgressEvent('error')
    });
    authService.register.and.returnValue(throwError(() => errorResponse));

    component.form.patchValue({
      name: 'John', username: 'john123', email: 'john@example.com',
      phone: '123456789', address: 'Street 1', password: '123456', confirmPassword: '123456',
      isDeliveryMan: false, vehicleTypes: {}
    });

    component.onSubmit();
    expect(component.error()).toContain('Please check your connection');
  });
});
