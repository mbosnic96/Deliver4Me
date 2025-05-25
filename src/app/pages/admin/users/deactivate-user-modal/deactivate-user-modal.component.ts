import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-deactivate-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deactivate-user-modal.component.html',
  styleUrl: './deactivate-user-modal.component.css'
})
export class DeactivateUserModalComponent {
  public activeModal = inject(NgbActiveModal);
  private adminService = inject(AdminService);

  @Input() userId!: string;
  @Input() isDeleteMode: boolean = true;

  onConfirm(): void {
    if (!this.userId) return;

    if (this.isDeleteMode) {
      this.confirmDelete();
    } else {
      this.confirmRestore();
    }
  }

  private confirmDelete(): void {
    Swal.fire({
      title: 'Obriši korisnika?',
      text: 'Korisnik neće više moći koristiti aplikaciju.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, obriši',
      cancelButtonText: 'Otkaži'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(this.userId).subscribe({
          next: (res) => {
            Swal.fire('Obrisan!', res.message, 'success');
            this.activeModal.close('deleted');
          },
          error: () => {
            Swal.fire('Greška', 'Neuspješno brisanje korisnika.', 'error');
          }
        });
      }
    });
  }

  private confirmRestore(): void {
    Swal.fire({
      title: 'Vrati korisnika?',
      text: 'Korisniku će ponovo biti omogućen pristup.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Da, vrati',
      cancelButtonText: 'Otkaži'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.restoreUser(this.userId).subscribe({
          next: (res) => {
            Swal.fire('Vraćen!', res.message, 'success');
            this.activeModal.close('restored');
          },
          error: () => {
            Swal.fire('Greška', 'Neuspješno vraćanje korisnika.', 'error');
          }
        });
      }
    });
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
