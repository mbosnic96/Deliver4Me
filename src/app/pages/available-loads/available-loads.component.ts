import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadService } from '../../core/services/load.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import { Router } from '@angular/router';
import { CscService } from '../../core/services/csc.service';
import { ICountry, IState, ICity } from 'country-state-city';
import { NgSelectComponent } from '@ng-select/ng-select';
import { environment } from '../../../enviroments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-available-loads',
  imports: [CommonModule, FormsModule, NgSelectComponent, FontAwesomeModule],
  templateUrl: './available-loads.component.html',
  styleUrls: ['./available-loads.component.css']
})
export class AvailableLoadsComponent implements OnInit {
    imageBaseUrl = environment.apiUrl;
    showAdvancedFilters = false;

filters: any = {
  pickupCountry: '',
  pickupState: '',
  pickupCity: '',
  deliveryCountry: '',
  deliveryState: '',
  deliveryCity: '',
  preferredPickupDate: null,
  preferredDeliveryDate: null,
  minFixedPrice: null,
  maxFixedPrice: null,
  cargoWeight: null,
  cargoVolume: null,
  minCargoWidth: null,
  maxCargoWidth: null,
  minCargoHeight: null,
  maxCargoHeight: null,
  minCargoLength: null,
  maxCargoLength: null,
  status: 'Aktivan'
};


  pickupCountries: ICountry[] = [];
  pickupStates: IState[] = [];
  pickupCities: ICity[] = [];

  deliveryCountries: ICountry[] = [];
  deliveryStates: IState[] = [];
  deliveryCities: ICity[] = [];

  DataArray: any[] = [];

  constructor(
    private loadService: LoadService,
    private csc: CscService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pickupCountries = this.csc.getAllCountries();
    this.deliveryCountries = this.csc.getAllCountries();
    this.fetchLoads();
  }

  fetchLoads(): void {
    this.loadService.getAllLoads().subscribe(data => {
      this.DataArray = data;
      this.cd.detectChanges();
    });
  }

  onPickupCountryChange(): void {
    this.pickupStates = this.csc.getStatesByCountry(this.filters.pickupCountry);
    this.filters.pickupState = '';
    this.filters.pickupCity = '';
    this.pickupCities = [];
  }

onPickupStateChange(): void {
  this.pickupCities = this.csc.getCitiesByCountry(this.filters.pickupCountry);
  // optionally reset selected city
  this.filters.pickupCity = '';
}




  onDeliveryCountryChange(): void {
    this.deliveryStates = this.csc.getStatesByCountry(this.filters.deliveryCountry);
    this.filters.deliveryState = '';
    this.filters.deliveryCity = '';
    this.deliveryCities = [];
  }
onDeliveryStateChange(): void {
  this.deliveryCities = this.csc.getCitiesByCountry(this.filters.deliveryCountry);
  // optionally reset selected city
  this.filters.deliveryCity = '';
}
private formatDate(date: string | null): string | null {
  if (!date) return null;
  // Ensure the date is in DD-MM-YYYY format
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
}

private getFormattedFilters() {
  const f = this.filters;
  return {
    ...f,
    preferredPickupDate: this.formatDate(f.preferredPickupDate),
    preferredPickupDateTo: this.formatDate(f.preferredPickupDateTo),
    preferredDeliveryDate: this.formatDate(f.preferredDeliveryDate),
    preferredDeliveryDateTo: this.formatDate(f.preferredDeliveryDateTo),
    // Convert numeric fields to numbers
  };
}

applyFilters(): void {
  const formattedFilter = this.getFormattedFilters();
  console.log('Sending filters:', this.filters); // Check the console for this output
  this.loadService.filterLoads(this.getFormattedFilters()).subscribe(data => {
    this.DataArray = data;
    this.cd.detectChanges();
  });
}


  resetFilters(): void {
    this.filters = {};
    this.pickupStates = [];
    this.pickupCities = [];
    this.deliveryStates = [];
    this.deliveryCities = [];
    this.fetchLoads();
  }

 viewLoadDetails(loadId: string) {
    this.router.navigate(['/load', loadId]);
  }


}