import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeedbackService } from '../../services/feedback.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-feedback-dialog',
  templateUrl: './view-feedback-dialog.component.html',
  styleUrls: ['./view-feedback-dialog.component.css'],
  imports: [CommonModule]
})
export class ViewFeedbackDialogComponent implements OnInit {
  feedbacks: any[] = [];
  averageRating: number = 0;
  starsArray: number[] = [1, 2, 3, 4, 5];

  constructor(
    private feedbackService: FeedbackService,
    private dialogRef: MatDialogRef<ViewFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: string }
  ) {}

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.feedbackService.getFeedbacksByEventId(this.data.eventId).subscribe({
      next: (data: any[]) => {
        this.feedbacks = data;
        this.calculateAverageRating();
      },
      error: (error: any) => console.error('Error fetching feedback:', error)
    });
  }

  calculateAverageRating(): void {
    if (this.feedbacks.length > 0) {
      const totalRating = this.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      this.averageRating = totalRating / this.feedbacks.length;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
