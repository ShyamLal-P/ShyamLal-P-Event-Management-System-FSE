import { Routes } from '@angular/router';
import { LoginComponent } from './Auth-Component/login/login.component';
import { RegisterComponent } from './Auth-Component/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { BookTicketsComponent } from './Book-Tickets-Component/book-tickets/book-tickets.component';
import { MyBookingsComponent } from './My-Bookings-Component/my-bookings/my-bookings.component';
import { CancelTicketDialogComponent } from './My-Bookings-Component/cancel-ticket-dialog/cancel-ticket-dialog.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'home', component: HomeComponent },
  { path: 'my-events', component: MyEventsComponent},
  { path: 'cancel-ticket-dialog', component: CancelTicketDialogComponent},
  { path: 'my-bookings', component: MyBookingsComponent},
  { path: 'book-tickets', component: BookTicketsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the landing page
];
