import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { TableComponent } from '../../../components/table/table.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeactivateUserModalComponent } from './deactivate-user-modal/deactivate-user-modal.component';
import { CscService } from '../../../core/services/csc.service';

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
  
    private modalService = inject(NgbModal);
    private cscService = inject(CscService);

  ngOnInit(){
    this.fetchUsers()
  }

  
  fetchUsers(): void {
  this.adminService.getAllUsers().subscribe(data => {
    this.users = data.map(user => ({
      ...user,
      country : this.getCountryName(user.country),
      state: this. getStateName(user.country, user.state),
    }));
    this.cd.detectChanges();
  });
}

  getCountryName(code: string): string {
  return this.cscService.getCountryNameByCode(code) ?? code;
}

getStateName(countryCode: string, stateCode: string): string {
  return this.cscService.getStateNameByCode(countryCode, stateCode) ?? stateCode;
}

  editUser(index: number) {
  const user = this.users[index];
  const modalRef = this.modalService.open(DeactivateUserModalComponent, {
    size: 'xl',
    backdrop: 'static'
  });

  modalRef.componentInstance.userId = user.id;
  modalRef.componentInstance.isDeleteMode = !user.isDeleted; 
  modalRef.result.then((result) => {
    if (result === 'deleted' || result === 'restored') {
      this.fetchUsers();
    }
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
