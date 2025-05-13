import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehiclesModalComponent } from './driver-vehicles-modal.component';

describe('DriverVehiclesModalComponent', () => {
  let component: DriverVehiclesModalComponent;
  let fixture: ComponentFixture<DriverVehiclesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverVehiclesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVehiclesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
