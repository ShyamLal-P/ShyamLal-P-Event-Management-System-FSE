import { Component } from '@angular/core';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HomeHeaderComponent, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isSidebarOpen = true;

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }
}
