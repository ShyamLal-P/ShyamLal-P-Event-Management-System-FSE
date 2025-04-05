import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { SidebarComponent } from "../sidebar/sidebar.component"; // Import MessageService
import { HomeHeaderComponent } from '../home-header/home-header.component';

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

  constructor(private router: Router, private messageService: MessageService) { }
  onSidebarToggled(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  ngOnInit() {
    console.log('Home component initialized');
    this.message = this.messageService.getMessage();
    console.log('Received message in home component:', this.message);
    if (this.message) {
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000); // Hide message after 3 seconds
    } else {
      console.log('No message received in home component');
    }
  }
}
