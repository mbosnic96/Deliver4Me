import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AccountSettingsComponent } from '../../components/account-settings/account-settings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
export const adminRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'account', component: AccountSettingsComponent },
    ]
  }
];
