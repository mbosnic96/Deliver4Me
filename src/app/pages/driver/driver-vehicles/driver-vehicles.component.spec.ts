import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehiclesComponent } from './driver-vehicles.component';

describe('DriverVehiclesComponent', () => {
  let component: DriverVehiclesComponent;
  let fixture: ComponentFixture<DriverVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
