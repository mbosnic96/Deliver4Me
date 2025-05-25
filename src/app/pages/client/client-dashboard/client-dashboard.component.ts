import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import Chart from 'chart.js/auto';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLoadComponent } from './add-load/add-load.component';
import { LoadService } from '../../../core/services/load.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewService } from '../../../core/services/review.service';
import { DriverService } from '../../../core/services/driver.service';
import { CscService } from '../../../core/services/csc.service';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent {


  constructor(private modalService: NgbModal, private loadService: LoadService, private cscService: CscService,private cd: ChangeDetectorRef, private router: Router, private authService: AuthService,private driverService: DriverService, private reviewService: ReviewService) { }

  userLoads: any[] = [];
  recommendedDrivers: any[] = [];
  imageBaseUrl = environment.apiUrl;

   averageRating: number = 0;
  totalReviews: number = 0;
  
  totalLoads: number = 0;



  map!: L.Map;

  ngOnInit() {
  //  this.initChart();
    this.fetchUserLoads();
    this.fetchUserRating();
    this.fetchRecommendedDrivers();
  }

  fetchUserLoads() {
  this.loadService.getMyLoads().subscribe({
    next: (loads) => {
      
      this.totalLoads = loads.length;
       this.userLoads = loads.filter(l => l.status !== 'Dostavljen');
      
      setTimeout(() => {
    this.initMap(); 
  });
        this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Greška pri preuzimanju podataka:', err);
    }
  });
}

fetchRecommendedDrivers() {
  this.driverService.getRecommendedDrivers().subscribe({
    next: (drivers) => {
      this.recommendedDrivers = drivers;
      this.cd.detectChanges();
    },
    error: (err) => console.error('Greška pri preporuci dostavljača:', err)
  });
}

getCountryName(code: string): string {
  return this.cscService.getCountryNameByCode(code) ?? code;
}

getStateName(countryCode: string, stateCode: string): string {
  return this.cscService.getStateNameByCode(countryCode, stateCode) ?? stateCode;
}


  private initChart() {
    new Chart('costChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'KM potrošeno',
          data: [120, 150, 90, 180, 200, 170, 220, 250, 300, 280, 320, 350],
          backgroundColor: '#0d6efd',
        }]
      }
    });
  }

 
    private initMap(): void {
  this.map = L.map('map').setView([43.8563, 18.4131], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

 this.userLoads.forEach((load, index) => {
  if (load.pickupLatitude && load.pickupLongitude && load.deliveryLatitude && load.deliveryLongitude) {
    const fromCoords: [number, number] = [load.pickupLatitude, load.pickupLongitude];
    const toCoords: [number, number] = [load.deliveryLatitude, load.deliveryLongitude];

    const fromMarker = L.marker(fromCoords).addTo(this.map);
    fromMarker.bindPopup(`
      <strong>${load.title}</strong><br>
      <b>Opis:</b> ${load.description}<br>
      <b>Preuzimanje:</b> ${load.pickupCity}, ${load.pickupAddress}<br>
      <b>Datum:</b> ${load.preferredPickupDate?.split('T')[0]} ${load.pickupTime}
    `);

    const toMarker = L.marker(toCoords).addTo(this.map);
    toMarker.bindPopup(`
      <strong>${load.title}</strong><br>
      <b>Dostava:</b> ${load.deliveryCity}, ${load.deliveryAddress}<br>
      <b>Datum:</b> ${load.preferredDeliveryDate?.split('T')[0]} ${load.maxDeliveryTime}
    `);

    const color = this.getColorForIndex(index);
    const control = L.Routing.control({
      waypoints: [L.latLng(...fromCoords), L.latLng(...toCoords)],
      lineOptions: {
        styles: [{ color, opacity: 0.8, weight: 5 }]
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      showAlternatives: false,
      routeWhileDragging: false,
      itinerary: { show: false }
    }).addTo(this.map);
    
control.hide();
  }
});

}
private getColorForIndex(index: number): string {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'teal', 'brown'];
  return colors[index % colors.length];
}

  fetchUserRating() {
    const userId = this.getUser();
    if (!userId) return;

    this.reviewService.getUserRating(userId).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        this.totalReviews = data.totalReviews;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Greška pri preuzimanju ocjene:', err)
    });
  }

  getUser(): string {
    const user = this.authService.getCurrentUser();
    return user?.id;
  }



  openAddModal() {
    const modalRef = this.modalService.open(AddLoadComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
  }

   viewLoadDetails(loadId: string) {
    this.router.navigate(['/load', loadId]);
  }

     viewUserDetails(loadId: string) {
    this.router.navigate(['/user', loadId]);
  }
}
