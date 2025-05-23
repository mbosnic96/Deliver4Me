import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { CommonModule } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLoadComponent } from '../client-dashboard/add-load/add-load.component';
import { LoadService } from '../../../core/services/load.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-loads',
  imports: [TableComponent, CommonModule, FontAwesomeModule],
  templateUrl: './my-loads.component.html',
  styleUrl: './my-loads.component.css'
})
export class MyLoadsComponent {
  userLoads: any[] = [];

  constructor(private modalService: NgbModal, private loadService: LoadService, private cd: ChangeDetectorRef, private router: Router) { }

    ngOnInit() {
    this.fetchUserLoads();
  }

    fetchUserLoads() {
  this.loadService.getMyLoads().subscribe({
    next: (loads) => {
       this.userLoads = loads;
        this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Greška pri preuzimanju podataka:', err);
    }
  });
}

 openAddModal() {
    const modalRef = this.modalService.open(AddLoadComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
  }


  editLoad(index: number) {
  const load = this.userLoads[index];
  const modalRef = this.modalService.open(AddLoadComponent, {
    size: 'xl',
    backdrop: 'static'
  });

  modalRef.componentInstance.loadData = load;

  modalRef.result.then((result) => {
    if (result === 'success') {
      this.fetchUserLoads(); // Refresh list
    }
  });
}

onDelete(index: number) {
  const load = this.userLoads[index];
  Swal.fire({
    title: 'Jeste li sigurni?',
    text: 'Ova akcija će trajno obrisati dostavu.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, obriši',
    cancelButtonText: 'Otkaži'
  }).then((result) => {
    if (result.isConfirmed) {
      this.loadService.deleteLoad(load.id).subscribe({
        next: () => {
          this.userLoads.splice(index, 1);
          this.cd.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'Obrisano',
            text: 'Dostava je uspješno obrisana.'
          });
        },
        error: (err) => {
          console.error('Greška prilikom brisanja:', err);
          Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Došlo je do greške prilikom brisanja dostave.'
          });
        }
      });
    }
  });
}

viewLoad(index: number) {
  const load = this.userLoads[index];
  if (load && load.id) {
    try {
      this.router.navigate(['/load', load.id])
        .then(success => {
          if (!success) {
            console.error('Navigation failed');
            // Optionally show error to user
          }
        })
        .catch(err => {
          console.error('Navigation error:', err);
        });
    } catch (e) {
      console.error('Error during navigation:', e);
    }
  } else {
    console.error('Invalid load or load ID');
  }
}




}
