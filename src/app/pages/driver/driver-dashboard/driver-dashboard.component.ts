import { ChangeDetectorRef, Component } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
// @ts-ignore

import { 
  faTruck, 
  faStar, 
  faTruckPickup, 
  faMoneyBill1Wave, 
  faMapMarkerAlt,
  faLocationDot,
  faBox,
  faPhone,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { VehicleMapComponent } from './vehicle-map/vehicle-map.component';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { VehicleTabsComponent } from './vehicle-tabs/vehicle-tabs.component';
import { DriverService } from '../../../core/services/driver.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-driver-dashboard',
  imports: [FontAwesomeModule, VehicleTabsComponent, CommonModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {
  

  constructor(private driverService: DriverService, private cd: ChangeDetectorRef, private router: Router, private authService: AuthService) { }
    faTruck = faTruck;
    faStar = faStar;
    faTruckPickup = faTruckPickup;
    faMoneyBillWave = faMoneyBill1Wave;
    
  faMapMarkerAlt = faMapMarkerAlt;
  faLocationDot = faLocationDot;
  faBox = faBox;
  faPhone = faPhone;
  faEye = faEye;
 
  userLoads: any[] = [];


  map!: L.Map;
    ngOnInit() {
    this.fetchUserLoads();
  }

   fetchUserLoads() {
  this.driverService.getMyLoads(this.getUser()).subscribe({
    next: (loads) => {
       this.userLoads = loads.filter(l => l.status === 'Poslan');
       
    this.initMap();
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

  carriers = [
    { label: 'Total', value: '2,345' },
    { label: 'Trucks', value: '456' },
    { label: 'Cargo Vans', value: '891' },
    { label: 'New', value: '123' },
    { label: 'Retail & Broker', value: '567' }
  ];

    driverVehicles = [
    { lat: 44.8164, lng: 15.8704 }, // Vehicle A
    { lat: 44.8064, lng: 15.8804 }  // Vehicle B
  ];

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
  
 
