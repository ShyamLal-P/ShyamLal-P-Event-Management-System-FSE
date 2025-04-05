import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HeaderComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', phoneNumber: '', roles: 'User' };
  confirmPassword: string = '';
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  countdown: number = 0;
  timerInterval: any;

  constructor(private authService: AuthService, private router: Router) { }

  showAlert(message: string, type: 'success' | 'error', countdownSeconds: number = 0) {
    this.alertMessage = message;
    this.alertType = type;

    if (type === 'success' && countdownSeconds > 0) {
      this.countdown = countdownSeconds;
      this.timerInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.timerInterval);
          this.alertMessage = null;
          this.router.navigate(['/login']);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        this.alertMessage = null;
      }, 3000);
    }
  }

  register() {
    if (this.user.password !== this.confirmPassword) {
      this.showAlert("Passwords do not match!", 'error');
      return;
    }

    const userPayload = {
      ...this.user,
      roles: [this.user.roles]
    };

    this.authService.register(userPayload).subscribe({
      next: () => {
        this.showAlert('Registration successful! Redirecting in', 'success', 5);
      },
      error: error => {
        console.error('Registration failed', error);
        this.showAlert('Registration failed. Please try again.', 'error');
      }
    });
  }
}
