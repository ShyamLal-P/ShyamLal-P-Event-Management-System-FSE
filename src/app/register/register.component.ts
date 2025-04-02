import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', password: '', roles: [] };

  constructor(private authService: AuthService) { }

  register() {
    this.authService.register(this.user).subscribe(response => {
      console.log('Registration successful', response);
      // Handle successful registration
    }, error => {
      console.error('Registration failed', error);
      // Handle registration error
    });
  }
}
