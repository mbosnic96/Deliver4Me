import { Component } from '@angular/core';

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
@Component({
  selector: 'app-driver-dashboard',
  imports: [VehicleMapComponent, FontAwesomeModule, VehicleTabsComponent, CommonModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {
    faTruck = faTruck;
    faStar = faStar;
    faTruckPickup = faTruckPickup;
    faMoneyBillWave = faMoneyBill1Wave;
    
  faMapMarkerAlt = faMapMarkerAlt;
  faLocationDot = faLocationDot;
  faBox = faBox;
  faPhone = faPhone;
  faEye = faEye;
    
     dataArray = [
    {
      id: 1,
      korisnik: 'Sakib Šljiva',
      lokacija_preuzimanja: 'Kostelska bb',
      lokacija_dostave: 'Celje SLO, Ljeva cesta',
      naziv_paketa: 'Kiseli kupus',
      kontakt: '0603004395',
      status: 'Arrived'
    },
    {
      id: 2,
      korisnik: 'Adnan Bešić',
      lokacija_preuzimanja: 'Bihac City Center',
      lokacija_dostave: 'Sarajevo, Titova 5',
      naziv_paketa: 'Televizor 50"',
      kontakt: '062112233',
      status: 'Pending'
    },
    {
      id: 2,
      korisnik: 'Adnan Bešić',
      lokacija_preuzimanja: 'Bihac City Center',
      lokacija_dostave: 'Sarajevo, Titova 5',
      naziv_paketa: 'Televizor 50"',
      kontakt: '062112233',
      status: 'Pending'
    },
    {
      id: 2,
      korisnik: 'Adnan Bešić',
      lokacija_preuzimanja: 'Bihac City Center',
      lokacija_dostave: 'Sarajevo, Titova 5',
      naziv_paketa: 'Televizor 50"',
      kontakt: '062112233',
      status: 'Pending'
    },
    {
      id: 2,
      korisnik: 'Adnan Bešić',
      lokacija_preuzimanja: 'Bihac City Center',
      lokacija_dostave: 'Sarajevo, Titova 5',
      naziv_paketa: 'Televizor 50"',
      kontakt: '062112233',
      status: 'Pending'
    },
    {
      id: 2,
      korisnik: 'Adnan Bešić',
      lokacija_preuzimanja: 'Bihac City Center',
      lokacija_dostave: 'Sarajevo, Titova 5',
      naziv_paketa: 'Televizor 50"',
      kontakt: '062112233',
      status: 'Pending'
    }
  ];



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

 
}
