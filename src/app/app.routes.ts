import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RoleGuard } from './core/guards/role.guard';
import { LoadPreviewComponent } from './pages/client/load-preview/load-preview.component';
import { AvailableLoadsComponent } from './pages/available-loads/available-loads.component';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'load/:id', component: LoadPreviewComponent},
  { path: 'user/:id', component: UserProfileComponent},
  { path: 'available-loads', component: AvailableLoadsComponent},

  {
    path: 'client',
    loadChildren: () => import('./pages/client/client.routes').then(m => m.clientRoutes),
    canActivate: [RoleGuard],
    data: { role: 'client' }
  },
  {
    path: 'driver',
    loadChildren: () => import('./pages/driver/driver.routes').then(m => m.driverRoutes),
    canActivate: [RoleGuard],
    data: { role: 'driver' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
];
