import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css'],
  providers: [DatePipe],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormField,
    MatLabel
  ]
})
export class FeedbackDialogComponent {
  feedback = {
    rating: 0,
    comments: ''
  };

  currentDate: string;
  currentTime: string;
  stars = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: string, userId: string, token: string, event: any }, // Ensure `event` is in the data
    private datePipe: DatePipe,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
  this.currentDate = this.datePipe.transform(now, 'shortDate')!;
  this.currentTime = this.datePipe.transform(now, 'shortTime')!;

  // ✅ Debug logs
  console.log('Dialog Data:', this.data);
  console.log('Token:', this.data.token);
}

  // Set the selected rating when a star is clicked
  rateEvent(rating: number): void {
    this.selectedRating = rating;
    this.feedback.rating = rating;
  }

  // Close the dialog without submitting
  close(): void {
    this.dialogRef.close();
  }

  // Submit feedback
  submitFeedback(): void {
    // Validate that rating is between 1 and 5
    if (this.feedback.rating < 1 || this.feedback.rating > 5) {
      this.snackBar.open('Please select a rating between 1 and 5', 'Close', { duration: 3000 });
      return;
    }

    // Create the payload for the feedback submission
    const payload = {
      eventId: this.data.eventId,
      userId: this.data.userId,
      rating: this.feedback.rating,
      comments: this.feedback.comments,
      submittedDate: this.currentDate,
      submittedTime: this.currentTime
    };

    this.loading = true;

    // Call the feedback service to submit the feedback
    this.feedbackService.submitFeedback(payload, this.data.token).subscribe({
      next: () => {
        this.snackBar.open('Feedback submitted successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        const msg = error?.error || 'Error submitting feedback';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.loading = false;
      }
    });
  }
}
