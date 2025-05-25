import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CscService } from '../../core/services/csc.service';
import { ICountry, IState } from 'country-state-city';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { ChangeEmailModalComponent } from './change-email-modal/change-email-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import * as L from 'leaflet';


import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  imageBaseUrl = environment.apiUrl;
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cscService = inject(CscService);
  private router = inject(Router);
  private modalService= inject(NgbModal);
  private authService= inject(AuthService);
  private toastr= inject(ToastrService);

  countries: ICountry[] = [];
  states: IState[] = [];
  cities: any[] = [];
  loading = signal(false);

  private map: L.Map | null = null;
private marker: L.Marker | null = null;


  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    address: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    photoUrl: [''],
    
  latitude: [null],
  longitude: [null]
  });

  ngOnInit() {
    this.loadUserData();
    this.countries = this.cscService.getAllCountries();
  }



initMap(): void {
  let lat = this.profileForm.value.latitude;
  let lng = this.profileForm.value.longitude;

  if (!lat || !lng) {
    const city = this.profileForm.value.city;
    const country = this.profileForm.value.country;

    if (city && country) {
      const cityCoords = this.cscService.getCityLatLng(city, country);
      if (cityCoords) {
        lat = cityCoords.lat;
        lng = cityCoords.lng;
      }
    }
  }

  if (!lat || !lng) {
    console.warn('No location data to initialize map.');
    return;
  }


  this.map = L.map('map').setView([lat, lng], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

  this.marker.on('moveend', () => {
    const pos = this.marker!.getLatLng();
    this.profileForm.patchValue({
      latitude: pos.lat,
      longitude: pos.lng
    });
  });
}



  loadUserData() {
    this.loading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          username: user.userName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          country: user.country,
          state: user.state,
          city: user.city,
          postalCode: user.postalCode,
          photoUrl: this.imageBaseUrl+user.photoUrl,
          latitude: user.latitude,
          longitude: user.longitude
        });
        
        if (user.country) {
          this.states = this.cscService.getStatesByCountry(user.country);
        }
        if (user.state && user.country) {
          this.cities = this.cscService.getCitiesByCountry(user.country);
        }
        
        this.loading.set(false);
             setTimeout(() => this.initMap(), 0);
             
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.loading.set(false);
      }
    });
  }

  onCountrySelect(event: any) {
    const countryCode = event.isoCode;
    this.states = this.cscService.getStatesByCountry(countryCode);
    this.cities = [];
    this.profileForm.patchValue({ state: '', city: '' });
  }

onStateSelect(event: any) {
  const stateCode = event.isoCode;
  const countryCode = this.profileForm.get('country')?.value;

  if (countryCode && stateCode) {
    this.cities = this.cscService.getCitiesByCountry(countryCode);
    this.profileForm.patchValue({ city: '' });
  }
}

onCitySelect(cityName: string) {
  const countryCode = this.profileForm.get('country')?.value;
  const coords = this.cscService.getCityLatLng(cityName, countryCode);
  if (coords && this.map && this.marker) {
    this.map.setView([coords.lat, coords.lng], 12);
    this.marker.setLatLng([coords.lat, coords.lng]);

    
    this.profileForm.patchValue({
      latitude: coords.lat,
      longitude: coords.lng
    });
  }
}


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.patchValue({ photoUrl: e.target.result });
        this.profileForm.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
  this.profileForm.patchValue({ photoUrl: null });  
  this.profileForm.markAsDirty();
}


  saveProfile(): void {
    if (this.profileForm.invalid || this.profileForm.pristine) return;

    this.loading.set(true);
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastr.success('Uspješno ažurirano');
        this.profileForm.markAsPristine();
        
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.loading.set(false);
      }
    });
  }

  requestAccountDeletion(): void {
  Swal.fire({
    title: 'Jeste li sigurni?',
    text: 'Želite li obrisati svoj račun? Ova akcija se ne može opozvati.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, obriši račun',
    cancelButtonText: 'Otkaži',
  }).then(result => {
    if (result.isConfirmed) {
      this.loading.set(true);
      this.userService.requestAccountDeletion().subscribe({
        next: (res) => {
          this.loading.set(false);
          Swal.fire('Obrisano!', res.message, 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Neuspješan zahtjev za brisanje računa', err);
          this.loading.set(false);
          Swal.fire('Greška', 'Neuspješno brisanje računa.', 'error');
        }
      });
    }
  });
}

  /**modali */

  changeEmailModal() {
  const modalRef = this.modalService.open(ChangeEmailModalComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  
  modalRef.componentInstance.profileData = this.profileForm.value;

  modalRef.result.then((result) => {
    if (result === 'success') {
      
        this.toastr.success('Uspješno ažurirano');
      this.loadUserData(); 
    }
  });
}

changePasswordModal() {
  const modalRef = this.modalService.open(ChangePasswordModalComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  
  modalRef.result.then((result) => {
    if (result === 'success') {
      
        this.toastr.success('Uspješno ažurirano');
      this.loadUserData(); 
    }
  });
}

updatePositionOnly(): void {
  const lat = this.profileForm.get('latitude')?.value;
  const lng = this.profileForm.get('longitude')?.value;

  if (lat == null || lng == null) {
    Swal.fire('Error', 'Location not selected.', 'error');
    return;
  }

  this.loading.set(true);

  this.userService.updateLocation(lat, lng).subscribe({
    next: () => {
      this.loading.set(false);
      Swal.fire('Success', 'Location updated.', 'success');
    },
    error: () => {
      this.loading.set(false);
      Swal.fire('Error', 'Failed to update location.', 'error');
    }
  });
}

 getUserRole(): string {
    return this.authService.getCurrentUser()?.role || 'User';
  }


  
}