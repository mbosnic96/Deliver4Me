import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';

import { NavbarHeightService } from '../../core/services/navbar-height.service';
import { environment } from '../../../enviroments/environment';
import { ReviewService } from '../../core/services/review.service';
import { NotificationService } from '../../core/services/notification.service';


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


  constructor(public authService: AuthService, private navbarHeightService: NavbarHeightService, private reviewService: ReviewService,  private cd: ChangeDetectorRef, private notificationService:NotificationService) {}
   @ViewChild('navbar', { static: false }) navbar!: ElementRef;
     imageBaseUrl = environment.apiUrl;
     
   averageRating: number = 0;
   notifications: any[] = [];
unreadCount = 0;
showNotifications = false;


  ngAfterViewInit() {
    this.updateNavbarHeight();
    
        this.getRating();
        this.notificationService.startConnection();
        this.cd.detectChanges();
  }
ngOnInit() {
  this.notificationService.onNotificationReceived().subscribe(n => {
    this.notifications.unshift(n);
    this.unreadCount++;
  });

  this.fetchAndUpdateNotifications();

  setInterval(() => {
    this.fetchAndUpdateNotifications();
  }, 5000);
  this.cd.detectChanges();
}

fetchAndUpdateNotifications() {
  this.notificationService.fetchNotifications().subscribe(data => {
    this.notifications = data;
    this.unreadCount = data.filter(n => !n.isRead).length;
  });
}


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateNavbarHeight();
  }

  private updateNavbarHeight() {
    const height = this.navbar.nativeElement.offsetHeight;
    this.navbarHeightService.setNavbarHeight(height); 
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

    getUserUsername(): string {
    return this.authService.getCurrentUser()?.userName || 'User';
  }

    getRating() {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) return;

    this.reviewService.getUserRating(userId).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        
        this.cd.detectChanges();
      },
      error: (err) => console.error('Greška pri preuzimanju ocjene:', err)
    });
  }

  markAsRead(id: string) {
  this.notificationService.markAsRead(id).subscribe(() => {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }
  });
}


}

