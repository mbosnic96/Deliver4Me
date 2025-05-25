import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDatepicker, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CscService } from '../../../../core/services/csc.service';
import { LoadService } from '../../../../core/services/load.service';
import { UserService } from '../../../../core/services/user.service';
import { ICountry, IState, ICity } from 'country-state-city';
import * as L from 'leaflet';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonModule, DatePipe } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../../../enviroments/environment';

@Component({
  selector: 'app-add-load',
  imports: [NgSelectComponent, ReactiveFormsModule, CommonModule, LeafletModule, NgbDatepickerModule, FontAwesomeModule],
  templateUrl: './add-load.component.html',
  styleUrls: ['./add-load.component.css']
})
export class AddLoadComponent implements OnInit {
  @ViewChild('pickupMap') pickupMapElement!: ElementRef;
  @ViewChild('deliveryMap') deliveryMapElement!: ElementRef;
  imageBaseUrl = environment.apiUrl;
  addLoadForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  loadData: any;
  



  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];

  pickupMap!: L.Map;
  deliveryMap!: L.Map;
  pickupMarker!: L.Marker;
  deliveryMarker!: L.Marker;

  existingImages: { id: string; url: string }[] = [];
removedImageIds: string[] = [];
  selectedImages: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cscService: CscService,
    private loadService: LoadService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
  ) {}

ngOnInit(): void {
  this.initializeForm();
  this.loadCountries();

  if (!this.loadData) {
    this.setDefaultPickupLocation();
  }

  this.setupVolumeCalculation();
}


  ngAfterViewInit(): void {
  setTimeout(() => {
    this.initializeMaps();

    if (this.loadData) {
      this.isEditMode = true;
      this.populateForm(this.loadData);
    }
  });
}

statusOptions = [
  { value: 'Aktivan', label: 'Aktivan' },
  { value: 'Poslan', label: 'Poslan' },
  { value: 'Otkazan', label: 'Otkazan' },
  { value: 'Dostavljen', label: 'Dostavljen' }
];


  initializeForm(): void {
    this.addLoadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pickupCountry: ['', Validators.required],
      pickupState: ['', Validators.required],
      pickupCity: ['', Validators.required],
      pickupAddress: ['', Validators.required],
      deliveryCountry: ['', Validators.required],
      deliveryState: ['', Validators.required],
      deliveryCity: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      preferredPickupDate: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactPhone: ['', Validators.required],
      pickupTime: ['', Validators.required],
      preferredDeliveryDate: ['', Validators.required],
      maxDeliveryTime: ['', Validators.required],
      cargoWeight: ['', Validators.required],
      cargoWidth: ['', Validators.required],
      cargoHeight: ['', Validators.required],
      cargoLength: ['', Validators.required],
      cargoVolume: [{ value: '', disabled: true }, Validators.required],
      fixedPrice: ['', Validators.required],
      pickupLatitude: ['', Validators.required],
      pickupLongitude: ['', Validators.required],
      deliveryLatitude: ['', Validators.required],
      deliveryLongitude: ['', Validators.required],
      status: ['']
    });
  }


  loadCountries(): void {
    this.countries = this.cscService.getAllCountries();
  }

  onCountryChange(type: 'pickup' | 'delivery'): void {
    const countryCode = this.addLoadForm.get(`${type}Country`)?.value;
    this.states = this.cscService.getStatesByCountry(countryCode);
    this.addLoadForm.get(`${type}State`)?.reset();
    this.addLoadForm.get(`${type}City`)?.reset();
    this.cities = [];
  }

  onStateChange(type: 'pickup' | 'delivery'): void {
    const countryCode = this.addLoadForm.get(`${type}Country`)?.value;
    this.cities = this.cscService.getCitiesByCountry(countryCode);
    this.addLoadForm.get(`${type}City`)?.reset();
  }

  onCityChange(type: 'pickup' | 'delivery'): void {
    const countryCode = this.addLoadForm.get(`${type}Country`)?.value;
    const cityName = this.addLoadForm.get(`${type}City`)?.value;
    const latLng = this.cscService.getCityLatLng(cityName, countryCode);
    if (latLng) {
      this.addLoadForm.patchValue({
        [`${type}Latitude`]: latLng.lat,
        [`${type}Longitude`]: latLng.lng
      });
      this.updateMapMarker(type, latLng.lat, latLng.lng);
    }
  }

  initializeMaps(): void {
    this.pickupMap = L.map(this.pickupMapElement.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.pickupMap);
    this.pickupMarker = L.marker([0, 0], { draggable: true }).addTo(this.pickupMap);
    this.pickupMarker.on('dragend', () => {
      const position = this.pickupMarker.getLatLng();
      this.addLoadForm.patchValue({
        pickupLatitude: position.lat,
        pickupLongitude: position.lng
      });
    });

    this.deliveryMap = L.map(this.deliveryMapElement.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.deliveryMap);
    this.deliveryMarker = L.marker([0, 0], { draggable: true }).addTo(this.deliveryMap);
    this.deliveryMarker.on('dragend', () => {
      const position = this.deliveryMarker.getLatLng();
      this.addLoadForm.patchValue({
        deliveryLatitude: position.lat,
        deliveryLongitude: position.lng
      });
    });

    this.pickupMap.invalidateSize();
this.deliveryMap.invalidateSize();

  }

  setDefaultPickupLocation(): void {
  this.userService.getCurrentUser().subscribe(user => {
    const lat = user.latitude || 0;
    const lng = user.longitude || 0;

    this.addLoadForm.patchValue({
      pickupCountry: user.country,
      pickupState: user.state,
      pickupCity: user.city,
      pickupAddress: user.address,
      pickupLatitude: lat,
      pickupLongitude: lng
    });

 
    this.states = this.cscService.getStatesByCountry(user.country);
    this.cities = this.cscService.getCitiesByCountry(user.country);


    this.pickupMap.setView([lat, lng], 13);
    this.pickupMarker.setLatLng([lat, lng]);

    this.cd.detectChanges();
  });
}


  updateMapMarker(type: 'pickup' | 'delivery', lat: number, lng: number): void {
    if (type === 'pickup') {
      this.pickupMap.setView([lat, lng], 13);
      this.pickupMarker.setLatLng([lat, lng]);
    } else {
      this.deliveryMap.setView([lat, lng], 13);
      this.deliveryMarker.setLatLng([lat, lng]);
    }
  }

  

  setupVolumeCalculation(): void {
    ['cargoWidth', 'cargoHeight', 'cargoLength'].forEach(field => {
      this.addLoadForm.get(field)?.valueChanges.subscribe(() => {
        this.calculateVolume();
      });
    });
  }

  calculateVolume(): void {
    const width = parseFloat(this.addLoadForm.get('cargoWidth')?.value) || 0;
    const height = parseFloat(this.addLoadForm.get('cargoHeight')?.value) || 0;
    const length = parseFloat(this.addLoadForm.get('cargoLength')?.value) || 0;
    const volume = width * height * length;
    this.addLoadForm.get('cargoVolume')?.setValue(volume.toFixed(2));
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

onSubmit(): void {
  if (this.addLoadForm.invalid || this.isLoading) return;

  this.isLoading = true;
  const formValues = this.addLoadForm.getRawValue();
  const formData = new FormData();

  if (formValues.preferredPickupDate) {
    formValues.preferredPickupDate = this.ngbDateToDateString(formValues.preferredPickupDate);
  }
  if (formValues.preferredDeliveryDate) {
    formValues.preferredDeliveryDate = this.ngbDateToDateString(formValues.preferredDeliveryDate);
  }

  for (const key in formValues) {
    if (formValues.hasOwnProperty(key)) {
      formData.append(key, formValues[key]);
    }
  }


  this.removedImageIds.forEach(id => {
    formData.append('RemovedImageIds', id);
  });


  this.selectedImages.forEach(file => {
    formData.append('Images', file);
  });

  const operation$ = this.isEditMode
    ? this.loadService.updateLoad(this.loadData.id, formData)
    : this.loadService.addLoad(formData);

  operation$.subscribe({
    next: () => {
      this.activeModal.close('success');
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error saving load', err);
      this.isLoading = false;
    }
  });
}

  
private ngbDateToDateString(ngbDate: NgbDateStruct): string {
  return `${ngbDate.year}-${ngbDate.month.toString().padStart(2, '0')}-${ngbDate.day.toString().padStart(2, '0')}`;
}



  onCancel(): void {
    if (this.addLoadForm.dirty) {
      if (confirm('Jeste li sigurni da želite otkazati? Sve izmjene se gube!')) {
        this.activeModal.dismiss();
      }
    } else {
      this.activeModal.dismiss();
    }
  }

populateForm(data: any): void {
  this.states = this.cscService.getStatesByCountry(data.deliveryCountry);
  this.cities = this.cscService.getCitiesByCountry(data.deliveryCountry);
  this.addLoadForm.patchValue({
    title: data.title,
    description: data.description,
    pickupCountry: data.pickupCountry,
    pickupState: data.pickupState,
    pickupCity: data.pickupCity,
    pickupAddress: data.pickupAddress,
    deliveryCountry: data.deliveryCountry,
    deliveryState: data.deliveryState,
    deliveryAddress: data.deliveryAddress,
    deliveryCity: data.deliveryCity, 
    preferredPickupDate: this.ddmmyyyyToNgbDate(data.preferredPickupDate),
    pickupTime: data.pickupTime,
    preferredDeliveryDate: this.ddmmyyyyToNgbDate(data.preferredDeliveryDate),
    contactPerson: data.contactPerson,
    contactPhone: data.contactPhone,
    maxDeliveryTime: data.maxDeliveryTime,
    cargoWeight: data.cargoWeight,
    cargoWidth: data.cargoWidth,
    cargoHeight: data.cargoHeight,
    cargoLength: data.cargoLength,
    cargoVolume: data.cargoVolume,
    fixedPrice: data.fixedPrice,
    pickupLatitude: data.pickupLatitude,
    pickupLongitude: data.pickupLongitude,
    deliveryLatitude: data.deliveryLatitude,
    deliveryLongitude: data.deliveryLongitude,
    status: data.status
  });

  this.updateMapMarker('pickup', data.pickupLatitude, data.pickupLongitude);
  this.updateMapMarker('delivery', data.deliveryLatitude, data.deliveryLongitude);
  
if (data.images && Array.isArray(data.images)) {
  this.existingImages = data.images.map((img: any) => ({
    id: img.id,
    url:`${this.imageBaseUrl}${img.image}`
  }));
  this.imagePreviews = this.existingImages.map(img => img.url);
}
  this.cd.detectChanges();
}




isoStringToNgbDate(dateString: string): NgbDateStruct | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}


ddmmyyyyToNgbDate(dateString: string): NgbDateStruct | null {
  if (!dateString) return null;

  const parts = dateString.split('-');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(part => parseInt(part, 10));
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return { year, month, day };
}


}
