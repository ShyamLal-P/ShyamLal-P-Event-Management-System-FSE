import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  message: string | null = null;
  isSuccess: boolean = false;

  constructor(private authService: AuthService) { }

  login() {
    console.log('Login method called');
    this.authService.login(this.credentials).subscribe(response => {
      console.log('Login successful', response);
      this.isSuccess = true;
      this.message = 'Login successful!';
      this.clearMessage();
    }, error => {
      console.error('Login failed', error);
      this.isSuccess = false;
      this.message = 'Login failed. Please try again.';
      this.clearMessage();
    });
  }

  clearMessage() {
    setTimeout(() => {
      this.message = null;
    }, 3000); // Clear message after 3 seconds
  }
}
