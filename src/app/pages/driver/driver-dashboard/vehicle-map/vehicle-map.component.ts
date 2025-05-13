import { Component } from '@angular/core';
import { Input } from '@angular/core';

import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

@Component({
  selector: 'app-vehicle-map',
  imports: [LeafletModule],
  templateUrl: './vehicle-map.component.html',
  styleUrl: './vehicle-map.component.css'
})
export class VehicleMapComponent {
   @Input() vehicles: Array<{ lat: number, lng: number }> = [];

  mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: L.latLng(44.8164, 15.8704) // Default center
  };

  get vehicleMarkers(): L.Marker[] {
    return this.vehicles.map((vehicle, index) => 
      L.marker([vehicle.lat, vehicle.lng], { 
        title: `Vehicle ${String.fromCharCode(65 + index)}`
      }).bindPopup(`Vehicle ${String.fromCharCode(65 + index)}`)
    );
  }
}
