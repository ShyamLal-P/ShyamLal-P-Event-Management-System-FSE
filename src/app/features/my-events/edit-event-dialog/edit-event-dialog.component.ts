// edit-event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../Core/services/event.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditEventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEventDialogComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public eventData: any
  ) {
    this.eventForm = this.fb.group({
      name: [eventData.name, Validators.required],
      location: [eventData.location, Validators.required],
      category: [eventData.category, Validators.required],
      date: [eventData.date, Validators.required],
      time: [eventData.time, Validators.required],
      eventPrice: [eventData.eventPrice, Validators.required],
      totalTickets: [eventData.totalTickets, Validators.required],
      availableTickets: [eventData.availableTickets, Validators.required]
    });
  }

  onSave(): void {
    if (this.eventForm.valid) {
      const token = localStorage.getItem('userToken');
      let organizerId = null;
  
      if (token) {
        const decoded: any = jwtDecode(token);
        organizerId = decoded.uid;
      }
  
      const updatedEvent = {
        ...this.eventForm.value,
        organizerId: organizerId,
        id: this.eventData.id // ✅ Send the original event ID
      };
  
      this.eventService.updateEvent(this.eventData.id, updatedEvent).subscribe({
        next: () => this.dialogRef.close(updatedEvent),
        error: err => console.error('Update failed', err)
      });
    }
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
