import { Injectable } from '@angular/core';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';

@Injectable({
  providedIn: 'root'
})
export class CscService {

  constructor() {}

  getAllCountries(): ICountry[] {
    return Country.getAllCountries();
  }

  getStatesByCountry(countryCode: string): IState[] {
    return State.getStatesOfCountry(countryCode);
  }

  getCitiesByCountry(countryCode: string): any[] {
    return City.getCitiesOfCountry(countryCode) || [];
  }


getCityLatLng(cityName: string, countryCode: string): { lat: number, lng: number } | null {
  const cities = City.getCitiesOfCountry(countryCode);
  const city = cities?.find(c => c.name === cityName);
  
  if (city?.latitude && city?.longitude) {
    return { lat: parseFloat(city.latitude), lng: parseFloat(city.longitude) };
  }

  return null;
}

getCountryNameByCode(code: string): string | null {
  const country = Country.getAllCountries().find(c => c.isoCode === code);
  return country ? country.name : null;
}
getStateNameByCode(countryCode: string, stateCode: string): string | null {
  const state = State.getStatesOfCountry(countryCode).find(s => s.isoCode === stateCode);
  return state ? state.name : null;
}



}
