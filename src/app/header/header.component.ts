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
    // Detect route changes and update state
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        console.log('🔄 NavigationEnd:', this.currentRoute);
        this.updateHeaderState();
      }
    });

    // On initial load
    this.updateHeaderState();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    console.log('🔐 isLoggedIn:', this.isLoggedIn);
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.navigateTo('login');
  }
}
