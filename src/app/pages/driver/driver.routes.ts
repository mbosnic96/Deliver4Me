// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { DriverVehiclesComponent } from './driver-vehicles/driver-vehicles.component';
export const adminRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DriverDashboardComponent },
      { path: 'vehicles', component: DriverVehiclesComponent },
    ]
  }
];
