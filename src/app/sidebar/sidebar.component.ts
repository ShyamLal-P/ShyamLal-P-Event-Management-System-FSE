import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [HeaderComponent]
})
export class SidebarComponent {
  isOpen = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen);
  }
}
