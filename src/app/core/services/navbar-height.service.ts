// navbar-height.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarHeightService {
  private navbarHeightSubject = new BehaviorSubject<number>(0);
  navbarHeight$ = this.navbarHeightSubject.asObservable();

  setNavbarHeight(height: number) {
    this.navbarHeightSubject.next(height);
  }
}
