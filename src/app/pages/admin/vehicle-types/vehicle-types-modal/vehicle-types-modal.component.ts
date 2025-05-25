import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vehicle-types-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-types-modal.component.html',
  styleUrl: './vehicle-types-modal.component.css'
})
export class VehicleTypesModalComponent {


  addVehicleTypeForm!: FormGroup;
  public activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);
  private cd = inject(ChangeDetectorRef);
@Input() vehicleType: any;


  typeData: any;

  isEditMode = false;
  isLoading = false;


  ngOnInit(): void {
    this.initializeForm();
  }


ngAfterViewInit(): void {
  if (this.vehicleType) {
    this.isEditMode = true;
     this.typeData = this.vehicleType;
    this.populateForm(this.vehicleType);
  }
}


  initializeForm(): void {
    this.addVehicleTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  populateForm(data: any): void {
    this.addVehicleTypeForm.patchValue({
      name: data.name,
      description: data.description,
    });
    this.cd.detectChanges();
  }

  onSubmit(): void {
    if (this.addVehicleTypeForm.invalid || this.isLoading) return;

    this.isLoading = true;


const formValues = this.addVehicleTypeForm.getRawValue();

const operation$ = this.isEditMode
  ? this.adminService.updateVehicleType(this.typeData.id, formValues)
  : this.adminService.addVehicleType(formValues);


    operation$.subscribe({
      next: () => {
        this.activeModal.close('success');
        this.toastr.success('Tip vozila uspješno dodan');
        this.isLoading = false;
        
    setTimeout(() => {
      this.isLoading = false;
      this.cd.detectChanges();
    });
      },
      error: (err) => {
        this.toastr.error('Greška', err);
        this.isLoading = false;
        setTimeout(() => {
      this.isLoading = false;
      this.cd.detectChanges();
    });
      }
    });
  }


  onCancel(): void {
    if (this.addVehicleTypeForm.dirty) {
      if (confirm('Jeste li sigurni da želite otkazati? Sve izmjene se gube!')) {
        this.activeModal.dismiss();
      }
    } else {
      this.activeModal.dismiss();
    }
  }




}

