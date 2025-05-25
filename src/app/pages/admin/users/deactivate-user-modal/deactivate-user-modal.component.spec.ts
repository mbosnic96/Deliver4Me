import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateUserModalComponent } from './deactivate-user-modal.component';

describe('DeactivateUserModalComponent', () => {
  let component: DeactivateUserModalComponent;
  let fixture: ComponentFixture<DeactivateUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
