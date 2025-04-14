import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './My-Events-Component/my-events/my-events.component';
import { LoginComponent } from './Auth-Component/login/login.component';
import { RegisterComponent } from './Auth-Component/register/register.component';
import { BookTicketDialogComponent } from './Book-Tickets-Component/book-ticket-dialog/book-ticket-dialog.component';
import { BookTicketsComponent } from './Book-Tickets-Component/book-tickets/book-tickets.component';
import { TicketComponent } from './Book-Tickets-Component/ticket/ticket.component';
import { EditEventDialogComponent } from './My-Events-Component/edit-event-dialog/edit-event-dialog.component';
import { FeedbackComponent } from './feedback/feedback.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'edit-event-dialog', component: EditEventDialogComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'feedback', component: FeedbackComponent },
  { path: 'home', component: HomeComponent },
  { path: 'feedback-dialog', component: FeedbackComponent },
  { path: 'book-tickets-dialog', component: BookTicketDialogComponent},
  { path: 'my-events', component: MyEventsComponent},
  { path: 'ticket', component: TicketComponent },
  { path: 'book-tickets', component: BookTicketsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the landing page
];
