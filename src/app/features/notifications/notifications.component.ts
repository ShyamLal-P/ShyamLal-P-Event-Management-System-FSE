import { Component } from '@angular/core';
import { HomeHeaderComponent } from '../../shared/components/home-header/home-header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [HomeHeaderComponent, SidebarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  isSidebarOpen = true;

  onSidebarToggled(open: boolean): void {
    this.isSidebarOpen = open;
  }
}
