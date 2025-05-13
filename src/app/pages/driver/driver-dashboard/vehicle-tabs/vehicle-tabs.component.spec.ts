import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTabsComponent } from './vehicle-tabs.component';

describe('VehicleTabsComponent', () => {
  let component: VehicleTabsComponent;
  let fixture: ComponentFixture<VehicleTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
