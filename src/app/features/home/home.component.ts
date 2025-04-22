import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../Core/services/message.service';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { AuthService } from '../../Core/services/auth.service';
import { EventService } from '../../Core/services/event.service';
import { jwtDecode } from 'jwt-decode';
import { HomeHeaderComponent } from '../../shared/components/home-header/home-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HomeHeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  message: string | null = null;
  showMessage: boolean = false;
  isSidebarOpen = true;

  userDetails: any = null;
  topEvents: any[] = [];
  currentEventIndex = 0;
  intervalId: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  onSidebarToggled(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  ngOnInit() {
    console.log('Home component initialized');

    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem('userRole', role);
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }

    this.message = this.messageService.getMessage();
    console.log('Retrieved message:', this.message); // Debug log
    if (this.message) {
      this.showMessage = true;
      setTimeout(() => this.showMessage = false, 3000);
    }

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.userDetails = res;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

    this.eventService.getTopEvents().subscribe({
      next: (events) => {
        this.topEvents = events;
        this.startAutoSlide();

        // Delay updateCarousel() after events and DOM are ready
        setTimeout(() => this.updateCarousel(), 0);
      },
      error: (err) => {
        console.error('Error fetching top events:', err);
      }
    });
  }

  ngAfterViewInit() {
    // Delay to allow DOM to render if events already available
    setTimeout(() => {
      if (this.topEvents.length > 0) {
        this.updateCarousel();
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  prevEvent() {
    this.currentEventIndex = (this.currentEventIndex > 0)
      ? this.currentEventIndex - 1
      : this.topEvents.length - 1;
    this.updateCarousel();
  }

  nextEvent() {
    this.currentEventIndex = (this.currentEventIndex < this.topEvents.length - 1)
      ? this.currentEventIndex + 1
      : 0;
    this.updateCarousel();
  }

  goToEvent(index: number) {
    this.currentEventIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (!track) {
      console.warn('carousel-track not found');
      return;
    }

    const eventTile = track.querySelector('.event-tile') as HTMLElement;
    if (!eventTile) {
      console.warn('event-tile not found');
      return;
    }

    const eventWidth = eventTile.clientWidth;
    const offsetX = (track.clientWidth - eventWidth) / 2;
    track.style.transform = `translateX(${offsetX - (this.currentEventIndex * eventWidth)}px)`;

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentEventIndex);
    });
  }

  startAutoSlide() {
    if (!this.topEvents.length) return;

    this.intervalId = setInterval(() => {
      this.nextEvent();
    }, 3500);
  }

  navigateToBookEvents() {
    this.router.navigate(['/book-tickets']);
  }
}
