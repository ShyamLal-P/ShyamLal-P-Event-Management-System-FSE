import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

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
  numberOfTickets: number = 1;
  totalFare: number = 0;
  message: string | null = null;
  paymentMethod: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<BookTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService,
    private router: Router
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
      next: () => {
        this.dialogRef.close(true);
        this.generatePDF(); // ✅ Generate ticket PDF here
      },
      error: (err) => {
        console.error(err);
        this.message = 'Booking failed. Try again.';
      },
    });
  }
  
  generatePDF(): void {
    const doc = new jsPDF();
  
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('🎟️ Event Ticket', 70, 20);
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 40;
    const lineHeight = 10;
  
    const lines = [
      `Event Name: ${this.data.event.name}`,
      `Location: ${this.data.event.location}`,
      `Date: ${new Date(this.data.event.date).toLocaleDateString()}`,
      `Time: ${this.data.event.time}`,
      `Price per Ticket: ₹${this.data.event.eventPrice}`,
      `Number of Tickets: ${this.numberOfTickets}`,
      `Total Fare: ₹${this.totalFare}`
    ];
  
    lines.forEach(line => {
      doc.text(line, 20, y);
      y += lineHeight;
    });
  
    doc.setTextColor(70, 130, 180);
    doc.setFontSize(14);
    doc.text('✅ Thank you for booking with Eventify!', 20, y + 10);
  
    doc.save('event-ticket.pdf');
  }  

  close(): void {
    this.dialogRef.close(false);
  }
}
