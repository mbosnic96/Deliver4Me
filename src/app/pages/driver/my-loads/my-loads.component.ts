import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../../../core/services/load.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../components/table/table.component';
import { DriverService } from '../../../core/services/driver.service';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-loads',
  imports: [TableComponent, CommonModule, FontAwesomeModule],
  templateUrl: './my-loads.component.html',
  styleUrl: './my-loads.component.css'
})
export class MyLoadsComponent {
userLoads: any[] = [];

  constructor(private driverService: DriverService, private cd: ChangeDetectorRef, private router: Router, private authService: AuthService) { }
    ngOnInit() {
    this.fetchUserLoads();
  }

  

    fetchUserLoads() {
  this.driverService.getMyLoads(this.getUser()).subscribe({
    next: (loads) => {
       this.userLoads = loads;
        this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Greška pri preuzimanju podataka:', err);
    }
  });
}

  getUser(): string {
    const user = this.authService.getCurrentUser();
    return user?.id;
  }



viewLoad(index: number) {
  const load = this.userLoads[index];
  if (load && load.id) {
    try {
      this.router.navigate(['/load', load.id])
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

deliverOrder(index: number) {
    const load = this.userLoads[index];
    
    Swal.fire({
      title: 'Potvrda dostave',
      text: 'Da li želite označiti teret kao dostavljen?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.driverService.markAsDelivered(load.id).subscribe({
          next: () => {
            Swal.fire(
              'Dostavljeno!',
              'Teret je dostavljen.',
              'success'
            );
            this.fetchUserLoads(); 
          },
          error: (err) => {
            console.error('Greška:', err);
            Swal.fire(
              'Error!',
              'Greška.',
              'error'
            );
          }
        });
      }
    });
  }

  cancelOrder(index: number) {
    const load = this.userLoads[index];
    
    Swal.fire({
      title: 'Otkazati',
      text: 'Da li sigurno želite otkazati teret?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.driverService.markAsCanceled(load.id).subscribe({
          next: () => {
            Swal.fire(
              'Otkazano!',
              'Teret otkazan.',
              'success'
            );
            this.fetchUserLoads();
          },
          error: (err) => {
            console.error('Greška:', err);
            Swal.fire(
              'Error!',
              'Greška',
              'error'
            );
          }
        });
      }
    });
  }
}