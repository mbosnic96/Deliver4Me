import { ChangeDetectorRef, Component } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { VehicleTabsComponent } from './vehicle-tabs/vehicle-tabs.component';
import { DriverService } from '../../../core/services/driver.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewService } from '../../../core/services/review.service';
@Component({
  selector: 'app-driver-dashboard',
  imports: [FontAwesomeModule, VehicleTabsComponent, CommonModule, RouterModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {
  

  constructor(private driverService: DriverService, private cd: ChangeDetectorRef, private router: Router, private authService: AuthService, private reviewService: ReviewService) { }

 
  userLoads: any[] = [];
   averageRating: number = 0;
  totalReviews: number = 0;
  totalLoads: number = 0;
  
  vehicles: any[] = [];
  

  vehicleCounts: { [type: string]: number } = {};
totalVehicles: number = 0;



  map!: L.Map;
    ngOnInit() {
    this.fetchUserLoads();
    this.fetchUserRating(); 
    this.fetchVehicles();
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

   fetchUserLoads() {
  this.driverService.getMyLoads(this.getUser()).subscribe({
    next: (loads) => {
      this.totalLoads = loads.length;
       this.userLoads = loads.filter(l => l.status === 'Poslan');
       
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

getUser(): string {
    const user = this.authService.getCurrentUser();
    return user?.id;
  }

fetchVehicles(): void {
  this.driverService.getVehicles().subscribe({
    next: (data) => {
      this.vehicles = data;
      this.totalVehicles = data.length;

      this.vehicleCounts = data.reduce((acc: any, vehicle: any) => {
        const model = vehicle.model || 'Nepoznato';
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      }, {});
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Error fetching vehicles', err);
      this.cd.detectChanges();
    }
  });
}
vehicleTypes(): string[] {
  return Object.keys(this.vehicleCounts);
}


  viewLoadDetails(loadId: string) {
    this.router.navigate(['/load', loadId]);
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
  }
  
 
