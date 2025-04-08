import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-book-ticket-dialog',
  templateUrl: './book-ticket-dialog.component.html',
  styleUrls: ['./book-ticket-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class BookTicketDialogComponent {
  numberOfTickets: number = 1;
  message: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<BookTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService
  ) {}

  bookTickets(): void {
    if (this.numberOfTickets < 1 || this.numberOfTickets > 6) {
      this.message = 'You can only book between 1 to 6 tickets.';
      return;
    }
  
    const bookingRequest = {
      userId: this.data.userId,
      eventId: this.data.eventId,
      numberOfTickets: this.numberOfTickets
    };
  
    this.bookingService.bookTickets(bookingRequest).subscribe({
      next: (res) => {
        this.message = 'Tickets booked successfully!';
        setTimeout(() => this.dialogRef.close(true), 2000);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Booking failed. Try again.';
      },
    });
  }
  

  close(): void {
    this.dialogRef.close(false);
  }
}
