import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadService } from '../../../core/services/load.service';
import { environment } from '../../../../enviroments/environment';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-load-preview',
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterModule],
  templateUrl: './load-preview.component.html',
  styleUrls: ['./load-preview.component.css'],
})
export class LoadPreviewComponent implements OnInit {
  loadData: any = null;
  user: any = null;

 
  imageBaseUrl = environment.apiUrl; // replace with your actual type/interface
 

  constructor(
    private route: ActivatedRoute,
    private loadService: LoadService,
    private cd: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchLoadById();
  }

  fetchLoadById() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadService.getLoadById(id).subscribe({
  next: (data) => {
    this.loadData = data;

    if (this.loadData.userId) {
      this.userService.getUserById(this.loadData.userId).subscribe({
        next: (userData) => {
          this.user = userData;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load user:', err);
        }
      });
    }

    this.cd.detectChanges();
  },
  error: (err) => {
    console.error('Failed to fetch load:', err);
  },
});

  }

 

  
}