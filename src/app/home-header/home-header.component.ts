import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HomeHeaderComponent {
  @Input() isSidebarOpen: boolean = true;
  @Input() user: any;
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.dropdownOpen = false;
    }
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
