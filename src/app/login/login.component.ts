import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router'; // Import Router
import { MessageService } from '../services/message.service'; // Import MessageService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent], // Add CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  message: string | null = null;
  isSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService // Inject MessageService
  ) {}

  login() {
    console.log('Login method called');
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        this.isSuccess = true;
        this.message = 'Login successful!';
        console.log('Message set to:', this.message);
        this.messageService.setMessage(this.message); // Set message in service
        localStorage.setItem('token', response.token); // ✅ Correct key
        this.router.navigate(['/home']);
        console.log('Navigating to home');
      },
      error => {
        console.error('Login failed', error);
        this.isSuccess = false;
        this.message = 'Login failed. Please try again.';
        console.log('Message set to:', this.message);
        this.clearMessage();
      }
    );
  }
  

  clearMessage() {
    setTimeout(() => {
      this.message = null;
      console.log('Message cleared');
    }, 3000); // Clear message after 3 seconds
  }
}