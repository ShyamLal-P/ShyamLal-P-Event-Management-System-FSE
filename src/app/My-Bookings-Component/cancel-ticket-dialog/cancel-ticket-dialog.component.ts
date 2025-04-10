import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TicketCancellationService } from '../../services/ticket-cancellation.service';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-cancel-ticket-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, FormsModule],
  templateUrl: './cancel-ticket-dialog.component.html',
  styleUrls: ['./cancel-ticket-dialog.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CancelTicketDialogComponent implements OnInit {
  @Output() cancellationSuccess = new EventEmitter<string>();

  numberOfTicketsToCancel: number = 1;
  bookedTicketsArray: number[] = [];
  message: string = '';
  showCancelConfirmation: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CancelTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ticketCancellationService: TicketCancellationService
  ) {}

  ngOnInit(): void {
    this.bookedTicketsArray = Array.from({ length: this.data.event.totalTickets - this.data.event.availableTickets }, (_, i) => i + 1);
  }

  close(): void {
    this.dialogRef.close();
  }

  openCancelDialog(): void {
    this.showCancelConfirmation = true;
  }

  confirmCancel(confirm: boolean): void {
    if (confirm) {
      this.cancelTickets();
    } else {
      this.showCancelConfirmation = false;
    }
  }

  cancelTickets(): void {
    const userId = this.data.event.userId;
    const eventId = this.data.event.id;

    this.ticketCancellationService.cancelTickets(userId, eventId, this.numberOfTicketsToCancel).subscribe({
      next: (response) => {
        this.message = `${this.numberOfTicketsToCancel} tickets have been canceled. Refund amount: ₹${response.refundAmount}`;
        this.cancellationSuccess.emit('Tickets cancelled successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.message = `Error: ${error.message}`;
      }
    });
  }
}
