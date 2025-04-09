import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Import CUSTOM_ELEMENTS_SCHEMA
import { TicketCancellationService } from '../../services/ticket-cancellation.service'; // Import the new service

@Component({
  selector: 'app-cancel-ticket-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, FormsModule],
  templateUrl: './cancel-ticket-dialog.component.html',
  styleUrls: ['./cancel-ticket-dialog.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA
})
export class CancelTicketDialogComponent implements OnInit {
  numberOfTicketsToCancel: number = 1;
  bookedTicketsArray: number[] = [];
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<CancelTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ticketCancellationService: TicketCancellationService // Use the new service
  ) {}

  ngOnInit(): void {
    this.bookedTicketsArray = Array.from({ length: this.data.event.totalTickets - this.data.event.availableTickets }, (_, i) => i + 1);
  }

  close(): void {
    this.dialogRef.close();
  }

  cancelTickets(): void {
    const userId = this.data.event.userId; // Assuming userId is part of event data
    const eventId = this.data.event.id;

    this.ticketCancellationService.cancelTickets(userId, eventId, this.numberOfTicketsToCancel).subscribe({
      next: (response) => {
        this.message = `${this.numberOfTicketsToCancel} tickets have been canceled. Refund amount: ₹${response.refundAmount}`;
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.message = `Error: ${error.message}`;
      }
    });
  }
}
