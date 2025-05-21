import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableLoadsComponent } from './available-loads.component';

describe('AvailableLoadsComponent', () => {
  let component: AvailableLoadsComponent;
  let fixture: ComponentFixture<AvailableLoadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableLoadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableLoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
