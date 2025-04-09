import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HeaderComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', phoneNumber: '', role: '' };
  confirmPassword: string = '';

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  countdown: number = 0;
  timerInterval: any;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  usernameError: string | null = null;
  emailError: string | null = null;
  passwordError: string | null = null;
  phoneError: string | null = null;
  confirmPasswordError: string | null = null;
  roleError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateUsername() {
    this.usernameError = /\s/.test(this.user.username) ? 'Username must not contain spaces.' : null;
  }

  validateEmail() {
    this.emailError = !this.user.email.endsWith('@gmail.com') ? 'Email must end with @gmail.com.' : null;
  }

  validatePassword() {
    const requirements = [];
    if (!/(?=.*[A-Z])/.test(this.user.password)) requirements.push('an uppercase letter');
    if (!/(?=.*[0-9])/.test(this.user.password)) requirements.push('a number');
    if (!/(?=.*[!@#$%^&*])/.test(this.user.password)) requirements.push('a special character');
    if (this.user.password.length < 8) requirements.push('at least 8 characters');

    this.passwordError = requirements.length > 0 ? `Password must contain ${requirements.join(', ')}.` : null;
  }

  validateConfirmPassword() {
    this.confirmPasswordError = this.user.password !== this.confirmPassword ? 'Passwords do not match!' : null;
  }

  validatePhoneNumber() {
    this.phoneError = this.user.phoneNumber.length !== 10 ? 'Phone number must be exactly 10 digits.' : null;
  }

  validateRole() {
    this.roleError = !this.user.role ? 'Please select a role.' : null;
  }

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
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validatePhoneNumber();
    this.validateRole();

    if (
      this.usernameError ||
      this.emailError ||
      this.passwordError ||
      this.phoneError ||
      this.confirmPasswordError ||
      this.roleError
    ) {
      this.showAlert('Please fix the errors before submitting.', 'error');
      return;
    }

    const userPayload = { ...this.user, roles: [this.user.role] };

    this.authService.register(userPayload).subscribe({
      next: () => this.showAlert('Registration successful! Redirecting...', 'success', 5),
      error: () => this.showAlert('Registration failed. Please try again.', 'error'),
    });
  }
}
 