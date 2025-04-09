import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-ticket-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './cancel-ticket-dialog.component.html',
  styleUrls: ['./cancel-ticket-dialog.component.css']
})
export class CancelTicketDialogComponent {
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<CancelTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  cancelTickets(): void {
    // Logic to cancel tickets
    this.message = 'Tickets have been canceled.';
    this.dialogRef.close(true);
  }
}
