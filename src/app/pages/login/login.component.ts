import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router ,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

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
        
        this.toastr.error('Greška prilikom logina');
        this.error = 'Login uspješan, nepotpuni podaci.';
        return;
      }

      switch (user.role.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        case 'driver':
          this.router.navigate(['/driver']);
          break;
        case 'client':
        default:
          this.router.navigate(['/client']);
          break;
      }
    },
    error: (err) => {
      const msg = err?.status === 401
        ? 'Pogrešan email ili password'
        : err?.message || 'Please check your connection and try again.';
      
        this.toastr.error(msg);
    }
  });
}

}
