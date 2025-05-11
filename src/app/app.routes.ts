import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RoleGuard } from './core/guards/role.guard'; // path as needed

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard/client',
    component: ClientDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'client' }
  },
  {
    path: 'dashboard/driver',
    component: DriverDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'driver' }
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
  { path: '**', redirectTo: 'login' }
];
