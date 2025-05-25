import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriverService } from '../../../../core/services/driver.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../enviroments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-driver-vehicles-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './driver-vehicles-modal.component.html',
  styleUrls: ['./driver-vehicles-modal.component.css']
})
export class DriverVehiclesModalComponent implements OnInit {
    imageBaseUrl = environment.apiUrl;
  driverVehicleForm: FormGroup;
  vehicleTypes: any[] = [];
  @Input() vehicleData: any;
  isEditMode = false;
  isLoading = false;
  selectedImages: File[] = [];
imagePreviews: string[] = [];
removedImageIds: string[] = [];

existingImages: { id: string; url: string }[] = [];


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private driverService: DriverService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.driverVehicleForm = this.fb.group({
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      model: ['', [Validators.required, Validators.maxLength(50)]],
      plateNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9- ]+$/i)]],
      width: [0, [Validators.required, Validators.min(0.1), Validators.max(10)]],
      length: [0, [Validators.required, Validators.min(0.1), Validators.max(20)]],
      height: [0, [Validators.required, Validators.min(0.1), Validators.max(5)]],
      volume: [{value: 0, disabled: true}],
      vehicleTypeId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchVehicleTypes();

    if (this.vehicleData) {
      this.isEditMode = true;
      this.patchFormValues();
    }

    this.setupVolumeCalculation();
  }

  private fetchVehicleTypes(): void {
    this.isLoading = true;
    this.driverService.getVehicleTypes().subscribe({
      next: (types) => {
        this.vehicleTypes = types;
        setTimeout(() => {
        this.cd.detectChanges(); 
      });
      this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching vehicle types', err);
        this.isLoading = false;
      }
    });
  }

private patchFormValues(): void {
  this.driverVehicleForm.patchValue({
    ...this.vehicleData,
    vehicleTypeId: this.vehicleData.vehicleType?.id
  });

  if (this.vehicleData.images && Array.isArray(this.vehicleData.images)) {
  this.existingImages = this.vehicleData.images.map((img: any) => ({
    id: img.id,
    url: `${this.imageBaseUrl}${img.imageUrl}`
  }));

  this.imagePreviews = [...this.existingImages.map(img => img.url)];
}

}









  private setupVolumeCalculation(): void {
    const dimensionControls = ['width', 'length', 'height'];
    dimensionControls.forEach(control => {
      this.driverVehicleForm.get(control)?.valueChanges.subscribe(() => {
        this.calculateVolume();
      });
    });
  }

  calculateVolume(): void {
  const width = Number(this.driverVehicleForm.get('width')?.value);
  const length = Number(this.driverVehicleForm.get('length')?.value);
  const height = Number(this.driverVehicleForm.get('height')?.value);

  if (!isNaN(width) && !isNaN(length) && !isNaN(height) && 
      width > 0 && length > 0 && height > 0) {
    const preciseVolume = width * length * height;
    const roundedVolume = Math.round(preciseVolume * 100) / 100; 
    
    this.driverVehicleForm.get('volume')?.setValue(roundedVolume, { emitEvent: false });
  } else {
    this.driverVehicleForm.get('volume')?.setValue(0, { emitEvent: false });
  }
}

onSubmit(): void {
  if (this.driverVehicleForm.invalid || this.isLoading) return;

  this.isLoading = true;
  const formValues = this.driverVehicleForm.getRawValue();
  const formData = new FormData();


  for (const key in formValues) {
    if (formValues.hasOwnProperty(key)) {
      formData.append(key, formValues[key]);
    }
  }

  this.removedImageIds.forEach(id => {
  formData.append('RemovedImageIds', id);
});


  this.selectedImages.forEach((file) => {
    formData.append('Images', file); 
  });

  const operation$ = this.isEditMode
    ? this.driverService.updateVehicle(this.vehicleData.id, formData)
    : this.driverService.addVehicle(formData);

  operation$.subscribe({
    next: () => {
      this.activeModal.close('success');
      
      this.toastr.success('Vozilo uspješno dodano');
      this.isLoading = false;
    },
    error: (err) => {
      this.toastr.error('Greška pri dodavanju vozila.', err);
      this.isLoading = false;
    }
  });
}




  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  Array.from(input.files).forEach(file => {
    this.selectedImages.push(file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews.push(e.target.result); 
      this.cd.detectChanges(); 
    };
    reader.readAsDataURL(file);
  });
}

removeImage(index: number): void {
  const previewUrl = this.imagePreviews[index];


  const existingImage = this.existingImages.find(img => img.url === previewUrl);
  if (existingImage) {
    this.removedImageIds.push(existingImage.id);
    this.existingImages = this.existingImages.filter(img => img.id !== existingImage.id);
  } else {
    this.selectedImages.splice(index - this.existingImages.length, 1);
  }

  this.imagePreviews.splice(index, 1);
}



  onCancel(): void {
    if (this.driverVehicleForm.dirty) {
      if (confirm('Jeste li sigurni da želite otkazati? Sve izmjene se gube!')) {
        this.activeModal.dismiss();
      }
    } else {
      this.activeModal.dismiss();
    }
  }
}