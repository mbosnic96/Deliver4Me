import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import Chart from 'chart.js/auto';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
// @ts-ignore
import * as LRouting from 'leaflet-routing-machine';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLoadComponent } from './add-load/add-load.component';
import { LoadService } from '../../../core/services/load.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent {


  constructor(private modalService: NgbModal, private loadService: LoadService, private cd: ChangeDetectorRef, private router: Router) { }

  userLoads: any[] = [];


  summary = {
    total: 128,
    active: 14,
    completed: 102,
    avgBid: '45.00 KM',
    avgTime: '2h 30min',
    rating: 4.9
  };




recommendedDrivers = [
  {
    name: 'Dostavljač A',
    rating: 4.8,
    image: 'user.png',
    location: 'Sarajevo',
    phone: '061/111-222'
  },
  {
    name: 'Dostavljač B',
    rating: 4.9,
    image: 'user.png',
    location: 'Tuzla',
    phone: '062/333-444'
  }
];


  map!: L.Map;

  ngOnInit() {
    this.initChart();
    this.fetchUserLoads();
  }

  fetchUserLoads() {
  this.loadService.getMyLoads().subscribe({
    next: (loads) => {
       this.userLoads = loads.filter(l => l.status !== 'Dostavljen');
      
    this.initMap();
        this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Failed to fetch loads:', err);
    }
  });
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




  openAddModal() {
    const modalRef = this.modalService.open(AddLoadComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
  }

   viewLoadDetails(loadId: string) {
    this.router.navigate(['/load', loadId]);
  }
}
