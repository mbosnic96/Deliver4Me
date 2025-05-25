import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverService } from '../../../core/services/driver.service';
import { TableComponent } from '../../../components/table/table.component';
import { VehicleTypesModalComponent } from './vehicle-types-modal/vehicle-types-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

  import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-types',
  imports: [TableComponent, FontAwesomeModule],
  templateUrl: './vehicle-types.component.html',
  styleUrl: './vehicle-types.component.css'
})
export class VehicleTypesComponent {

  vehicleTypes: any[] = [];
  
  private driverService = inject(DriverService);
  
  private cd = inject(ChangeDetectorRef);
  private adminService = inject(AdminService);

  
    private modalService = inject(NgbModal);
    private toastr = inject(ToastrService);


      private fetchVehicleTypes(): void {
    this.driverService.getVehicleTypes().subscribe({
      next: (types) => {
        this.vehicleTypes = types;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        this.toastr.error('Greška pri preuzimanju podataka', err);
      }
    });
  }

   ngOnInit(): void {
    this.fetchVehicleTypes();
  }

   openAddModal() {
      const modalRef = this.modalService.open(VehicleTypesModalComponent, {
        size: 'xl',
        backdrop: 'static'
      });
       modalRef.result.then((result) => {
      if (result === 'success') {
        this.fetchVehicleTypes(); 
      }
    });
    }

    editVehicleType(index: number) {
    const type = this.vehicleTypes[index];
    const modalRef = this.modalService.open(VehicleTypesModalComponent, {
      size: 'xl',
      backdrop: 'static'
    });
  
    modalRef.componentInstance.vehicleType = type;
  
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.fetchVehicleTypes(); 
      }
    });
  }


  deleteVehicleType(index: number): void {
  const type = this.vehicleTypes[index];
  Swal.fire({
    title: 'Jeste li sigurni?',
    text: "Ova akcija će obrisati tip vozila ako se ne koristi!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Da, obriši!',
    cancelButtonText: 'Ne, odustani'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminService.deleteVehicleType(type.id).subscribe({
        next: () => {
          Swal.fire(
            'Obrisano!',
            'Tip vozila je uspješno obrisan.',
            'success'
          );
          this.fetchVehicleTypes();
        },
        error: (err) => {
          Swal.fire(
            'Greška!',
            err.error?.message || 'Tip vozila se ne može obrisati jer se koristi.',
            'error'
          );
        }
      });
    }
  });
}
}
