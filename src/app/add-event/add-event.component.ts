import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddEventComponent {
  eventForm: FormGroup;
  apiUrl = 'http://localhost:5081/api'; // ✅ Base API URL

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      eventPrice: [0, [Validators.required, Validators.min(0)]],
      totalTickets: [0, [Validators.required, Validators.min(1)]],
    });
  }

  logClick() {
    console.log('Button clicked');
  }

  onSubmit(): void {
    console.log('Form submitted');
    if (this.eventForm.valid) {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const organizerId = decodedToken?.uid;

        const formData = {
          ...this.eventForm.value,
          organizerId: organizerId
        };

        console.log('Sending to API:', formData);

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.apiUrl}/Event`, formData, { headers }).subscribe({
          next: (res) => {
            console.log('Response from API:', res);
            alert('Event added successfully!');
            this.eventForm.reset();
          },
          error: err => {
            alert('Failed to add event.');
            console.error(err);
          }
        });
      } else {
        alert('User not authenticated.');
      }
    } else {
      alert('Form is invalid.');
    }
  }
}
