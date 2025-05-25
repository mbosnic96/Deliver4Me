import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

 onSubmit() {
  if (this.passwordForm.invalid || this.isLoading) return;

  this.isLoading = true;
  this.errorMessage = null;

  const currentPassword = this.passwordForm.get('currentPassword')?.value;
  const newPassword = this.passwordForm.get('newPassword')?.value;

  this.userService.updatePassword({ currentPassword, newPassword }).subscribe({
    next: () => {
      this.isLoading = false;
      this.activeModal.close('success');
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Failed to update password.';
    }
  });
}


  onCancel() {
    this.activeModal.dismiss();
  }
}
