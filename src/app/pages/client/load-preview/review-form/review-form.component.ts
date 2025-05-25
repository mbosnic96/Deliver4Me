import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BidService } from '../../../../core/services/bid.service';

@Component({
  selector: 'app-review-form',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent {
 @Input() toUserId!: string;
  @Input() loadId!: string;
  @Output() reviewSubmitted = new EventEmitter<void>();

  selectedRating = 0;
  hoverRating = 0;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      rating: [0],
      comment: ['']
    });
  }

  
  setRating(rating: number) {
    this.selectedRating = rating;
    this.form.patchValue({ rating });
  }

  submit() {
  if (!this.selectedRating) return;

  const payload = {
    toUserId: this.toUserId,
    loadId: this.loadId,
    rating: this.selectedRating,
    comment: this.form.value.comment
  };



  this.reviewService.submitReview(payload).subscribe({
    next: () => {
      this.toastr.success('Recenzija poslana!');
      this.reviewSubmitted.emit();
      this.form.reset();
      this.selectedRating = 0;
    },
    error: err => this.toastr.error(err?.error?.message || 'Greška')
  });
}




}