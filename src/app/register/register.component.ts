import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HeaderComponent], // Add FormsModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', phoneNumber: '', roles: 'User' }; // Default role to 'User'

  constructor(private authService: AuthService) { }

  register() {
    // Convert roles string to array with a single element
    const userPayload = {
      ...this.user,
      roles: [this.user.roles]
    };

    console.log('Request Payload:', userPayload); // Log the request payload

    this.authService.register(userPayload).subscribe({
      next: response => {
        console.log('Registration successful', response);
        // Handle successful registration
      },
      error: error => {
        console.error('Registration failed', error);
        // Handle registration error
      },
      complete: () => {
        console.log('Registration process completed');
      }
    });
  }
}
