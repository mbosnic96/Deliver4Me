import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CscService } from '../../core/services/csc.service';
import { ICountry, IState, ICity } from 'country-state-city';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgSelectModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cscService = inject(CscService);

  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];

  loading = signal(false);
  error = signal('');

  isDelivery = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    address: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.countries = this.cscService.getAllCountries();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onCountrySelect(event: ICountry) {
    const countryCode = event.isoCode;
    this.states = this.cscService.getStatesByCountry(countryCode);
    this.cities = [];
    this.form.patchValue({ state: '', city: '' });
  }

  onStateSelect(event: IState) {
    const stateCode = event.isoCode;
    const countryCode = this.form.value.country;
    if (countryCode && stateCode) {
      this.cities = this.cscService.getCitiesByCountry(countryCode);
      this.form.patchValue({ city: '' });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      role: this.isDelivery ? 'driver' : 'client',
      isDeliveryMan: this.isDelivery,
    };

    this.loading.set(true);
    this.error.set('');

    this.authService.register(payload).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.message || 'An unexpected error occurred. Please try again later.';
        this.error.set(msg);
      }
    });
  }
}
