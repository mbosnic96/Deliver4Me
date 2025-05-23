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
        this.navbarHeight = height; 
      }
    );
  }

  ngOnDestroy() {
    this.navbarHeightSubscription.unsubscribe(); 
  }

  collapsed = false;
  role: 'client' | 'driver' | 'admin';

  constructor(private authService: AuthService, private navbarHeightService: NavbarHeightService) {
    this.role = this.authService.getCurrentUser()?.role  
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}

