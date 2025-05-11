import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { finalize } from 'rxjs/operators';
import { CscService } from '../../core/services/csc.service';
import { ICountry, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SharedModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
    private cscService = inject(CscService);

  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];

  loading = signal(false);
  error = signal('');

    ngOnInit() {
    this.countries = this.cscService.getAllCountries();
      console.log('Sample country:', this.countries[0]); // Verify ISO code structure
  }

 onCountrySelect(event: any) {
   const countryCode = event.isoCode; // Get the actual country code
  this.states = this.cscService.getStatesByCountry(countryCode);
  this.cities = [];
  this.form.patchValue({ state: '', city: '' });
}

onStateSelect(event: any) {
  const stateCode = event.isoCode; 
  const countryCode = this.form.value.country;
  if (countryCode && stateCode) {
    this.cities = this.cscService.getCitiesByCountry(countryCode);
    this.form.patchValue({ city: '' });
  }
}


  isDelivery = false;
  vehicleTypes = ['Van', 'Truck', 'Long Truck', 'Truck for Sand', 'Junk Hauler'];
  VehicleType: string[] = [];

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
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', Validators.required],
  vehicleTypes: [[]] 
}, { validators: this.passwordMatchValidator });


  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  


  onSubmit(): void {
    if (this.form.invalid) return;
    

   const formData = this.form.value;
const payload = {
  ...formData,
  role: this.isDelivery ? 'driver' : 'client',
  isDeliveryMan: this.isDelivery,
  vehicleTypes: this.isDelivery ? formData.vehicleTypes : []
};

if (this.isDelivery && (!formData.vehicleTypes || formData.vehicleTypes.length === 0)) {
  this.error.set('Please select at least one vehicle type.');
  return;
}


    this.loading.set(true);
    this.error.set('');

    this.authService.register(payload).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.form.reset();
        this.VehicleType = [];
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.message || 'An unexpected error occurred. Please try again later.';
        this.error.set(msg);
      }
    });
  }
}
