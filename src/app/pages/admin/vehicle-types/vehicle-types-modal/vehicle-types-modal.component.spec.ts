import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypesModalComponent } from './vehicle-types-modal.component';

describe('VehicleTypesModalComponent', () => {
  let component: VehicleTypesModalComponent;
  let fixture: ComponentFixture<VehicleTypesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTypesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
