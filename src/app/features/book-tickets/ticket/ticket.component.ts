import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketComponent implements OnInit {
  event: any;
  numberOfTickets!: number;
  totalFare!: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.event = history.state.event;
    this.numberOfTickets = history.state.numberOfTickets;
    this.totalFare = history.state.totalFare;

    if (this.event) {
      setTimeout(() => {
        this.generatePDF();
      }, 0);
    }
  }

  generatePDF(): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('🎟️ Event Ticket', 70, 20);

    // Add event details manually (creating table-like structure)
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    // Draw the "table" content with lines
    const startX = 20; 
    const startY = 30; 
    const rowHeight = 10;

    // Headers
    doc.text('Attribute', startX, startY);
    doc.text('Details', startX + 90, startY);

    // Add a line below headers
    doc.line(startX, startY + 2, startX + 180, startY + 2);

    // Add rows for ticket details
    const ticketDetails = [
      ['Event Name', this.event.name],
      ['Location', this.event.location],
      ['Date', new Date(this.event.date).toLocaleDateString()],
      ['Time', this.event.time],
      ['Price per Ticket', `₹${this.event.eventPrice}`],
      ['Number of Tickets', this.numberOfTickets.toString()],
      ['Total Fare', `₹${this.totalFare}`]
    ];

    let currentY = startY + 15; // Starting Y position for the rows

    ticketDetails.forEach((detail) => {
      doc.text(detail[0], startX, currentY);  // Attribute
      doc.text(detail[1], startX + 90, currentY);  // Details
      currentY += rowHeight;
    });

    // Add a final line after the table
    doc.line(startX, currentY + 2, startX + 180, currentY + 2);

    // Add thank you message
    doc.setFontSize(14);
    doc.setTextColor(70, 130, 180);
    doc.text('✅ Thank you for booking with Eventify!', 40, currentY + 15);

    // Save the PDF
    doc.save('event-ticket.pdf');
  }
}
