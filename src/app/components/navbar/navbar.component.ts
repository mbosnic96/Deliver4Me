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
    return this.authService.getCurrentUser()?.profileImage || 'https://scontent.fsjj3-1.fna.fbcdn.net/v/t39.30808-6/336722646_6015778125166086_7030387524882819766_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pHXpEnOzDE8Q7kNvwE9B5ul&_nc_oc=AdnyR9KSyvQ88HWvWjh9pJN_kqYOHw5Y8xdKyoqfyUQq69sTlbMFf8EDVYxG5l-2BX6L1smGreIjckrXK1EcS-1Q&_nc_zt=23&_nc_ht=scontent.fsjj3-1.fna&_nc_gid=Immd90PeNqfSEmWMq4KPrg&oh=00_AfIQYgBK5X-zhtSPVIioVJcb7sCifeeSYFuWgpYcns5bzg&oe=6826CA53';
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

