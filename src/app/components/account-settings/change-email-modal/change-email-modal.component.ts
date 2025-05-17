import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-email-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-email-modal.component.html',
  styleUrls: ['./change-email-modal.component.css']
})
export class ChangeEmailModalComponent implements OnInit {
  @Input() profileData: any;  // <-- receive full profile data
  emailForm: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  public activeModal = inject(NgbActiveModal);

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    if (this.profileData && this.profileData.email) {
      this.emailForm.patchValue({ email: this.profileData.email });
    }
  }

  onSubmit(): void {
    if (this.emailForm.invalid || this.isLoading) return;

    this.isLoading = true;

    const updatedEmail = this.emailForm.get('email')?.value;

    // Clone profile data and update email
    const updatedProfile = { ...this.profileData, email: updatedEmail };

    this.userService.updateProfile(updatedProfile).subscribe({
      next: () => {
        this.isLoading = false;
        this.activeModal.close('success');
      },
      error: (err) => {
        console.error('Failed to update email', err);
        this.isLoading = false;
        // optionally display error to user
      }
    });
  }

  onCancel(): void {
    if (this.emailForm.dirty) {
      if (confirm('Are you sure you want to discard changes?')) {
        this.activeModal.dismiss();
      }
    } else {
      this.activeModal.dismiss();
    }
  }
}
