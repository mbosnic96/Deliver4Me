import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'; // Adjust to your app
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarHeightService } from '../../core/services/navbar-height.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  navbarHeight = 0;
  navbarHeightSubscription!: Subscription;


  ngOnInit() {
    this.navbarHeightSubscription = this.navbarHeightService.navbarHeight$.subscribe(
      (height) => {
        this.navbarHeight = height; // Update the navbar height when it changes
      }
    );
  }

  ngOnDestroy() {
    this.navbarHeightSubscription.unsubscribe(); // Unsubscribe when the component is destroyed
  }

  collapsed = false;
  role: 'client' | 'driver' | 'admin';

  constructor(private authService: AuthService, private navbarHeightService: NavbarHeightService) {
    this.role = this.authService.getCurrentUser()?.role  // Pull role from session/auth logic
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}

