import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true, // For Angular 14+ standalone component
  imports: [ReactiveFormsModule, CommonModule, RouterLink], // Import necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Define the form group
  form: FormGroup;

  // Define loading and error states as signals
  loading = false;
  error = '';

  // Injecting services via constructor
  constructor(
    private fb: FormBuilder, // FormBuilder for managing form controls
    private authService: AuthService, // AuthService for login functionality
    private router: Router // Router for navigation
  ) {
    // Initialize the form with validators
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Handle form submission
onSubmit(): void {
  if (this.form.invalid) return;

  const { email, password } = this.form.getRawValue();
  this.loading = true;
  this.error = '';

  this.authService.login(email, password).pipe(
    finalize(() => this.loading = false)
  ).subscribe({
    next: () => {
      this.form.reset();

      const user = this.authService.getCurrentUser();

      if (!user || !user.role) {
        this.error = 'Login successful, but user data is missing or invalid.';
        return;
      }

      switch (user.role.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/dashboard/admin']);
          break;
        case 'driver':
          this.router.navigate(['/dashboard/driver']);
          break;
        case 'client':
        case 'user':
        default:
          this.router.navigate(['/dashboard/client']);
          break;
      }
    },
    error: (err) => {
      const msg = err?.status === 401
        ? 'Invalid email or password'
        : err?.message || 'An unexpected error occurred. Please check your connection and try again.';
      this.error = msg;
    }
  });
}

}
