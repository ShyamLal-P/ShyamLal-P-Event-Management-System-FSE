import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { AuthService } from '../services/auth.service'; // 🔥 Import AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string | null = null;
  showMessage: boolean = false;
  isSidebarOpen = true;

  userDetails: any = null; // 🔥 Store current user

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService // 🔥 Inject AuthService
  ) {}

  onSidebarToggled(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  ngOnInit() {
    console.log('Home component initialized');

    const token = localStorage.getItem('userToken');
    console.log('Token from localStorage:', token); // 🔥 PRINT THE TOKEN

    this.message = this.messageService.getMessage();
    console.log('Received message in home component:', this.message);

    if (this.message) {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    } else {
      console.log('No message received in home component');
    }

    // 🔥 Fetch current user data from API
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('User data:', res);
        this.userDetails = res;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });
  }
}
