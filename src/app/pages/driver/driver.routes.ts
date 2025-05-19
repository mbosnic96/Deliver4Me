import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { DriverVehiclesComponent } from './driver-vehicles/driver-vehicles.component';
import { AccountSettingsComponent } from '../../components/account-settings/account-settings.component';
export const driverRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DriverDashboardComponent },
      { path: 'vehicles', component: DriverVehiclesComponent },
      { path: 'account', component: AccountSettingsComponent },
    ]
  }
];
