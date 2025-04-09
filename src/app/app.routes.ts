import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { LoginComponent } from './Auth-Component/login/login.component';
import { RegisterComponent } from './Auth-Component/register/register.component';
import { BookTicketDialogComponent } from './Book-Tickets-Component/book-ticket-dialog/book-ticket-dialog.component';
import { BookTicketsComponent } from './Book-Tickets-Component/book-tickets/book-tickets.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'home', component: HomeComponent },
  { path: 'book-tickets-dialog', component: BookTicketDialogComponent},
  { path: 'my-events', component: MyEventsComponent},
  { path: 'book-tickets', component: BookTicketsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the landing page
];
