import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { MatDialogModule } from '@angular/material/dialog';  // <-- Import MatDialogModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,  // Add FormsModule here
    MatDialogModule,  // <-- Add MatDialogModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]  // Add DatePipe to the providers array
})
export class AppComponent {
  title = 'Event-Management-App';
}
