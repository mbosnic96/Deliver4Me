import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { TableComponent } from '../../../components/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: any[] = [];
  private adminService = inject(AdminService);
  private router = inject(Router);
  
  private cd = inject(ChangeDetectorRef);

  ngOnInit(){
    this.fetchUsers()
  }

  
  fetchUsers(): void {
    this.adminService.getAllUsers().subscribe(data => {
      this.users = data;
      this.cd.detectChanges();
    });
  }

  viewUser(index: number) {
  const user = this.users[index];
  if (user && user.id) {
    try {
      this.router.navigate(['/user', user.id])
        .then(success => {
          if (!success) {
            console.error('Fail');
          }
        })
        .catch(err => {
          console.error('Error:', err);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  } else {
    console.error('loš ID');
  }
}
}
