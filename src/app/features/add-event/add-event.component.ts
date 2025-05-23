import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from '../../shared/components/home-header/home-header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../Core/services/auth.service';
import { CanComponentDeactivate } from '../../Core/guards/can-deactivate.guard';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HomeHeaderComponent, SidebarComponent]
})
export class AddEventComponent implements OnInit, CanComponentDeactivate {
  eventForm: FormGroup;
  apiUrl = 'http://localhost:5081/api';
  message: string | null = null;
  isSuccess = false;
  isSidebarOpen = true;
  userDetails: any = null;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), this.textValidator]],
      location: ['', [Validators.required, Validators.minLength(3), this.textValidator]],
      category: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator]],
      time: ['', Validators.required],
      eventPrice: [0, [Validators.required, Validators.min(0)]],
      totalTickets: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    console.log('Add Event component initialized');
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('Fetched User Details:', res);
        this.userDetails = res;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  logClick(): void {
    console.log('Button clicked');
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const organizerId = decodedToken?.uid;

        const formData = {
          ...this.eventForm.value,
          organizerId: organizerId
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.apiUrl}/Event`, formData, { headers }).subscribe({
          next: (res) => {
            this.isSuccess = true;
            this.message = 'Event added successfully!';
            this.eventForm.reset();
            this.autoClearMessage();
          },
          error: err => {
            this.isSuccess = false;
            this.message = 'Failed to add event.';
            console.error(err);
            this.autoClearMessage();
          }
        });
      } else {
        this.isSuccess = false;
        this.message = 'User not authenticated.';
        this.autoClearMessage();
      }
    } else {
      this.isSuccess = false;
      this.message = 'Form is invalid.';
      this.autoClearMessage();
    }
  }

  autoClearMessage(): void {
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const today = new Date().toISOString().split('T')[0];
    if (control.value && control.value < today) {
      return { 'invalidDate': true };
    }
    return null;
  }

  textValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const textPattern = /^[a-zA-Z\s]*$/;
    if (control.value && !textPattern.test(control.value)) {
      return { 'invalidText': true };
    }
    return null;
  }

  // ✅ CanDeactivate support
  canDeactivate(): boolean {
    if (this.eventForm.dirty && !this.isSuccess) {
      return confirm('You have unsaved changes. Are you sure you want to leave this page?');
    }
    return true;
  }
}
