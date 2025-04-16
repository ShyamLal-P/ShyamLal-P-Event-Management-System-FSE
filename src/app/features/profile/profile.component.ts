import { Component, OnInit } from '@angular/core';
import { HomeHeaderComponent } from '../../shared/components/home-header/home-header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../Core/services/auth.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HomeHeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isSidebarOpen = true;
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }

  loadUserDetails(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data: any) => {
        this.user = data;
        this.extractRoleFromToken();
        console.log('User details:', this.user); // Log user details to verify
      },
      error: (error: any) => console.error('Error fetching user details:', error),
      complete: () => console.log('User details fetched successfully')
    });
  }

  extractRoleFromToken(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.user.role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
  }
}
