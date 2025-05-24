import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoadService } from '../../../core/services/load.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
  private cd = inject(ChangeDetectorRef);
  private adminService = inject(AdminService);

    DataArray: any[] = [];
      totalLoads: number = 0;
        activeLoads: number = 0;
        deliveredLoads: number = 0;
        sentLoads: number = 0;
        canceledLoads: number = 0;
        userCount: number = 0;

        ngOnInit(){
          this.fetchLoads();
          this.fetchUsers();
        }

  fetchLoads(): void {
    this.adminService.getAllLoads().subscribe(data => {
      this.totalLoads = data.length;
      this.activeLoads = data.filter(data => data.status === 'Aktivan').length;
      this.deliveredLoads = data.filter(data => data.status === 'Dostavljen').length;
      this.sentLoads = data.filter(data => data.status === 'Poslan').length;
      this.canceledLoads = data.filter(data => data.status === 'Otkazan').length;
      this.cd.detectChanges();
    });
  }


  fetchUsers(): void {
    this.adminService.getAllLoads().subscribe(data => {
      this.userCount = data.length;
      this.cd.detectChanges();
    });
  }
}
