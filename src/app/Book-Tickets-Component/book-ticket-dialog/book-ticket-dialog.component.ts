import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class BookTicketDialogComponent {
  tickets: number[] = [];
  numberOfTickets: number = 1; // Add this property
  totalFare: number = 0;
  message: string | null = null;
  paymentMethod: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<BookTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService
  ) {
    this.initializeTickets();
    this.calculateTotalFare();
  }

  initializeTickets(): void {
    const maxTickets = Math.min(this.data.event.availableTickets, 6);
    this.tickets = Array.from({ length: maxTickets }, (_, i) => i + 1);
  }

  calculateTotalFare(): void {
    if (this.numberOfTickets < 1 || this.numberOfTickets > 6) {
      this.totalFare = 0;
      this.message = 'Please select a valid number of tickets (1-6)';
    } else {
      this.totalFare = this.numberOfTickets * this.data.event.eventPrice;
      this.message = null;
    }
  }

  bookTickets(): void {
    if (this.numberOfTickets < 1 || this.numberOfTickets > 6) {
      this.message = 'Max limit is 6';
      return;
    }

    if (!this.paymentMethod) {
      this.message = 'Please select a payment method.';
      return;
    }

    const bookingRequest = {
      userId: this.data.userId,
      eventId: this.data.eventId,
      numberOfTickets: this.numberOfTickets,
      paymentMethod: this.paymentMethod
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