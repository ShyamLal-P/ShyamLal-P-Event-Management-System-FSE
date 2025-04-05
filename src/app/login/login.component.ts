import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
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
    private messageService: MessageService
  ) {}

  login() {
    console.log('Login method called');
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        this.isSuccess = true;
        this.message = 'Login successful!';
        this.messageService.setMessage(this.message);
  
        localStorage.setItem('token', response.token); // Save token
        console.log('✅ Token saved to localStorage');
  
        // Force route reload to trigger Header update
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/home']);
        });
  
      },
      error => {
        console.error('Login failed', error);
        this.isSuccess = false;
        this.message = 'Login failed. Please try again.';
        this.clearMessage();
      }
    );
  }

  clearMessage() {
    setTimeout(() => {
      this.message = null;
      console.log('Message cleared');
    }, 3000);
  }
}
