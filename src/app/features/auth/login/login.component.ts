import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/services/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Router } from '@angular/router';
import { MessageService } from '../../../Core/services/message.service';
import { jwtDecode } from 'jwt-decode';

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
        console.log('Message set to:', this.message);
  
        const token = response.jwtToken;
  
        // Decode token directly from response
        const decoded: any = jwtDecode(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]; // common userId claim
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log("Decoded Role:", role);
  
        // Save token and role
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', userId); // ✅ Add this line

  
        this.messageService.setMessage(this.message);
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
    }, 3000);
  }
}
