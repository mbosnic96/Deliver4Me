import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AccountSettingsComponent } from '../../components/account-settings/account-settings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './users/users.component';
import { VehicleTypesComponent } from './vehicle-types/vehicle-types.component';
export const adminRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'account', component: AccountSettingsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'vehicle-types', component: VehicleTypesComponent },
    ]
  }
];
