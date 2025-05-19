import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoadComponent } from './add-load.component';

describe('AddLoadComponent', () => {
  let component: AddLoadComponent;
  let fixture: ComponentFixture<AddLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
