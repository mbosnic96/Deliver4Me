import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverVehiclesModalComponent } from './driver-vehicles-modal/driver-vehicles-modal.component';
import { DriverService } from '../../../core/services/driver.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../enviroments/environment';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-driver-vehicles',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './driver-vehicles.component.html',
  styleUrl: './driver-vehicles.component.css'
})
export class DriverVehiclesComponent {
  imageBaseUrl = environment.apiUrl;
  vehicles: any[] = [];
    modalRef: any;
    
@Output() editRequest = new EventEmitter<number>();
constructor(private modalService: NgbModal, private driverService: DriverService, private cd: ChangeDetectorRef) {}


    ngOnInit(): void {
    this.fetchVehicles();
  }

fetchVehicles(): void {
  this.driverService.getVehicles().subscribe({
    next: (data) => {
      this.vehicles = data.map(vehicle => ({
        ...vehicle,
        imageUrls: (vehicle.images || [])
          .filter((img: any) => img.imageUrl && img.imageUrl.trim() !== '')
          .map((img: any) => `${this.imageBaseUrl}${img.imageUrl}`)
      }));
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Error fetching vehicles', err);
    }
  });
}



  
// For adding new vehicle
openAddModal() {
  const modalRef = this.modalService.open(DriverVehiclesModalComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  
  modalRef.result.then((result) => {
    if (result === 'success') {
      this.fetchVehicles(); // Refresh list
    }
  });
}

// For editing existing vehicle
editVehicle(vehicle: any) {
  const modalRef = this.modalService.open(DriverVehiclesModalComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  
  modalRef.componentInstance.vehicleData = vehicle;
  /*
  modalRef.result.then((result) => {
    if (result === 'success') {
      this.fetchVehicles(); // Refresh list
    }
  });*/
}


  // Placeholder for delete vehicle functionality
  deleteVehicle(vehicleId: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.driverService.deleteVehicle(vehicleId).subscribe({
        next: (response) => {
          Swal.fire(
            'Deleted!',
            'The vehicle has been deleted.',
            'success'
          );
          this.fetchVehicles(); // Refresh the list of vehicles
        },
        error: (err) => {
          console.error('Error deleting vehicle', err);
          Swal.fire(
            'Error!',
            'There was an error deleting the vehicle.',
            'error'
          );
        }
      });
    }
  });
}




}
