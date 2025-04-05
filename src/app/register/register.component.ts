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

  constructor(private authService: AuthService, private router: Router) { }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
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
        this.showAlert('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: error => {
        console.error('Registration failed', error);
        this.showAlert('Registration failed. Please try again.', 'error');
      }
    });
  }
}
