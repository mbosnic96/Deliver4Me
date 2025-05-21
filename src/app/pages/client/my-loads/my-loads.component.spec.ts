import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLoadsComponent } from './my-loads.component';

describe('MyLoadsComponent', () => {
  let component: MyLoadsComponent;
  let fixture: ComponentFixture<MyLoadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLoadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
