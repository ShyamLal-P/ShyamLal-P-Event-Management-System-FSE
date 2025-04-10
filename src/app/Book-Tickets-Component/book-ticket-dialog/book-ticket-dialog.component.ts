import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Ensure this is imported
import { MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-book-ticket-dialog',
  templateUrl: './book-ticket-dialog.component.html',
  styleUrls: ['./book-ticket-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Import CommonModule for *ngIf
    FormsModule,
    MatDialogModule, // Import MatDialogModule for mat-dialog-actions
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule // Import MatOptionModule for mat-option
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
        this.generatePDF();
        setTimeout(() => this.dialogRef.close(true), 2000);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Booking failed. Try again.';
      },
    });
  }

  generatePDF(): void {
    const doc = new jsPDF();
    const event = this.data.event;
  
    // Add ticket details
    doc.setFontSize(18);
    doc.text('Ticket Details', 10, 10);
  
    // Add event details
    doc.setFontSize(14);
    doc.text(`Event Name: ${event.name}`, 10, 20);
    doc.text(`Location: ${event.location}`, 10, 30);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 10, 40);
    doc.text(`Time: ${event.time}`, 10, 50);
    doc.text(`Price per Ticket: ₹${event.eventPrice}`, 10, 60);
  
    // Add bill summary
    doc.setFontSize(16);
    doc.text('Bill Summary', 10, 80);
    doc.setFontSize(14);
    doc.text(`Number of Tickets: ${this.numberOfTickets}`, 10, 90);
    doc.text(`Total Cost: ₹${this.totalFare}`, 10, 100);
  
    // Add thank you message
    doc.setFontSize(16);
    doc.text('Thank you for booking tickets!', 10, 120);
  
    // Save the PDF
    doc.save('ticket.pdf');
  }
  

  close(): void {
    this.dialogRef.close(false);
  }
}
