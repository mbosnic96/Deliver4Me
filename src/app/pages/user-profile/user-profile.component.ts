import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CscService } from '../../core/services/csc.service';
import { ICountry, IState } from 'country-state-city';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/environment';
import * as L from 'leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReviewListComponent } from "./review-list/review-list.component";
import { ReviewService } from '../../core/services/review.service';


@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FontAwesomeModule, ReviewListComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  constructor(
private route: ActivatedRoute,
  private userService:UserService,
  private cscService:CscService,
  private cd:ChangeDetectorRef,
  private reviewService:ReviewService){}

  imageBaseUrl = environment.apiUrl;
  user: any = null;
  vehicles: any[] = [];
  countries: ICountry[] = [];
  states: IState[] = [];
  cities: any[] = [];

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

     averageRating: number = 0;
  totalReviews: number = 0;

  ngOnInit() {
    this.countries = this.cscService.getAllCountries();
    this.loadUserById();
    this.getUserVehicles();
    this.fetchUserRating();
  }


  loadUserById() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        setTimeout(() => {
    this.initMap(); 
  });

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  getUserVehicles(){
 const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.userService.getVehiclesByUserId(id).subscribe({
  next: (vehicles) => {
    this.vehicles = vehicles;
        this.cd.detectChanges();
  },
  error: (err) => {
    console.error('Failed to load user vehicles', err);
  }
});

  }

  initMap(): void {
    if (!this.user) return;

    let lat = this.user.latitude;
    let lng = this.user.longitude;

    if (!lat || !lng) {
      const city = this.user.city;
      const country = this.user.country;
      if (city && country) {
        const cityCoords = this.cscService.getCityLatLng(city, country);
        if (cityCoords) {
          lat = cityCoords.lat;
          lng = cityCoords.lng;
        }
      }
    }

    if (!lat || !lng) return;

    this.map = L.map('map').setView([lat, lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng]).addTo(this.map);
  }

  getCountryName(code: string): string {
  return this.cscService.getCountryNameByCode(code) ?? code;
}

getStateName(countryCode: string, stateCode: string): string {
  return this.cscService.getStateNameByCode(countryCode, stateCode) ?? stateCode;
}

 fetchUserRating() {
     const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.reviewService.getUserRating(id).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        this.totalReviews = data.totalReviews;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Greška pri preuzimanju ocjene:', err)
    });
  }

}
