import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        console.log('🔄 NavigationEnd:', this.currentRoute);
        this.checkLoginStatus();
      }
    });

    // Also check immediately on load
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
  }

  navigateTo(section: string) {
    console.log('➡️ Navigating to:', section);
    this.router.navigate([section]);
  }

  logout() {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.navigateTo('login');
  }
}
