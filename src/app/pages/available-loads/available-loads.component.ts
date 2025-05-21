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
  filters: any = {
    pickupCountry: '',
    pickupState: '',
    pickupCity: '',
    deliveryCountry: '',
    deliveryState: '',
    deliveryCity: '',
    searchTerm: '',
    fixedPrice: false
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
    this.pickupCities = this.csc.getCitiesByCountry(this.filters.pickupCountry)
      .filter(c => c.stateCode === this.filters.pickupState);
  }

  onDeliveryCountryChange(): void {
    this.deliveryStates = this.csc.getStatesByCountry(this.filters.deliveryCountry);
    this.filters.deliveryState = '';
    this.filters.deliveryCity = '';
    this.deliveryCities = [];
  }

  onDeliveryStateChange(): void {
    this.deliveryCities = this.csc.getCitiesByCountry(this.filters.deliveryCountry)
      .filter(c => c.stateCode === this.filters.deliveryState);
  }

  applyFilters(): void {
    // Optional: Send filter values to backend or filter locally
    this.fetchLoads(); // for now, just re-fetch
    
      this.cd.detectChanges();
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