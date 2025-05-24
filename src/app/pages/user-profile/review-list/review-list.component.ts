import { ChangeDetectorRef, Component, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnChanges {
  @Input() userId!: string;
  reviews: any[] = [];

  constructor(private reviewService: ReviewService, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.getReviews();
    }
  }

  getReviews() {
    this.reviewService.getReviewsForUser(this.userId).subscribe({
      next: data => {
        this.reviews = data;
        this.cd.detectChanges();
      },
      error: err => console.error('Failed to fetch reviews:', err)
    });
  }
}
