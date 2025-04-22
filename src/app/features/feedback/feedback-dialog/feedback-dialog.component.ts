import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../Core/services/feedback.service';

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
  stars = [1, 2, 3, 4, 5]; // Array for star ratings
  loading = false; // Indicates submission status

  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: string; userId: string; token: string; event: any },
    private datePipe: DatePipe,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    this.currentDate = this.datePipe.transform(now, 'shortDate')!;
    this.currentTime = this.datePipe.transform(now, 'shortTime')!;

    console.log('Dialog Data:', this.data); // Debug information
    console.log('Token:', this.data.token); // Debug information
  }

  // Set rating for the feedback
  setRating(rating: number): void {
    this.feedback.rating = rating;
  }

  // Close the dialog without saving feedback
  close(): void {
    this.dialogRef.close();
  }

  getEmoji(index: number): string {
    const emojis = ['😞', '😐', '🙂', '😀', '😍']; // Emojis for star ratings
    return emojis[index];
  }

  // Validate the feedback form data
  private validateFeedback(): boolean {
    if (this.feedback.rating < 1 || this.feedback.rating > 5) {
      this.snackBar.open('Please select a rating between 1 and 5', 'Close', { duration: 3000 });
      return false;
    }
    return true;
  }

  // Display a snackbar message to the user
  private showSnackBar(message: string, action: string = 'Close', duration: number = 3000): void {
    this.snackBar.open(message, action, { duration });
  }

  // Submit the feedback to the server
  submitFeedback(): void {
    if (!this.validateFeedback()) {
      return;
    }

    const payload = {
      eventId: this.data.eventId,
      userId: this.data.userId,
      rating: this.feedback.rating,
      comments: this.feedback.comments,
      submittedDate: this.currentDate,
      submittedTime: this.currentTime
    };

    this.loading = true;

    this.feedbackService.submitFeedback(payload, this.data.token).subscribe({
      next: () => {
        this.showSnackBar('Feedback submitted successfully');
        this.dialogRef.close(true); // Pass true to indicate successful submission
      },
      error: (error: any) => {
        const errorMsg = error?.error || 'Error submitting feedback';
        this.showSnackBar(errorMsg, 'Close', 4000);
        this.loading = false;
      }
    });
  }
}
