import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';
import { NavbarHeightService } from '../../core/services/navbar-height.service';
import { environment } from '../../../enviroments/environment';
import { ReviewService } from '../../core/services/review.service';
import { NotificationService } from '../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef;

  imageBaseUrl = environment.apiUrl;
  averageRating: number = 0;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  userName = 'Unknown User';
  userUsername = 'User';
  userRole = 'User';
  profileImage = '/user.png';
  userId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private navbarHeightService: NavbarHeightService,
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef
  ) {}
  private notificationIntervalId: any = null;


  ngOnInit() {
        if (this.authService.isAuthenticated()) {
    this.notificationService.startConnection();
     }
     
    this.notificationService.onNotificationReceived()
      .pipe(takeUntil(this.destroy$))
      .subscribe(n => {
        this.notifications.unshift(n);
        this.unreadCount++;
        this.cd.detectChanges();
      });

  if (this.authService.isAuthenticated()) {
  this.notificationIntervalId = setInterval(() => {
    if (this.authService.isAuthenticated()) {
      this.fetchAndUpdateNotifications();
    }
  }, 5000);
}


   
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.userName = user?.name || 'Unknown User';
        this.userUsername = user?.userName || 'User';
        this.userRole = user?.role || 'User';
        this.profileImage = user?.photoUrl ? this.imageBaseUrl + user.photoUrl : '/user.png';
        this.userId = user?.id || '';
        if (user?.id) {
          this.getRating(user.id);
        }
        this.cd.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.updateNavbarHeight();
  
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
  if (this.notificationIntervalId) {
    clearInterval(this.notificationIntervalId);
    this.notificationIntervalId = null;
  }
  this.authService.logout();
}


  getProfileImage(): string {
    return this.profileImage;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserRole(): string {
    return this.userRole;
  }

  getUserUsername(): string {
    return this.userUsername;
  }

  getRating(userId: string) {
    this.reviewService.getUserRating(userId).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Greška pri preuzimanju ocjene:', err)
    });
  }

  fetchAndUpdateNotifications() {
    this.notificationService.fetchNotifications().subscribe(data => {
      this.notifications = data;
      this.unreadCount = data.filter(n => !n.isRead).length;
      this.cd.detectChanges();
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
        this.cd.detectChanges();
      }
    });
  }
}
