import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSignInAlt, 
  faUserPlus, 
  faUser, 
  faSignOutAlt,
  faStar,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';

import { NavbarHeightService } from '../../core/services/navbar-height.service';
import { environment } from '../../../enviroments/environment';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Icons
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
    faStar = faStar;
  faCog = faCog;

  constructor(public authService: AuthService, private navbarHeightService: NavbarHeightService) {}
   @ViewChild('navbar', { static: false }) navbar!: ElementRef;
     imageBaseUrl = environment.apiUrl;

  ngAfterViewInit() {
    this.updateNavbarHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateNavbarHeight();
  }

  private updateNavbarHeight() {
    const height = this.navbar.nativeElement.offsetHeight;
    this.navbarHeightService.setNavbarHeight(height); // Update the height in the service
  }

  logout(): void {
    this.authService.logout();
  }
 getProfileImage(): string {
    return this.imageBaseUrl+this.authService.getCurrentUser()?.photoUrl || '/user.png';
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.name || 'Unknown User';
  }

  getUserRole(): string {
    return this.authService.getCurrentUser()?.role || 'User';
  }

  getRating(): string {
    return this.authService.getCurrentUser()?.rating?.toFixed(1) || '4.8';
  }
}

