import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './Auth-Component/login/login.component';
import { RegisterComponent } from './Auth-Component/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor'; // <-- import
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './My-Events-Component/my-events/my-events.component';
import { BookTicketDialogComponent } from './Book-Tickets-Component/book-ticket-dialog/book-ticket-dialog.component';
import { BookTicketsComponent } from './Book-Tickets-Component/book-tickets/book-tickets.component';
import { MyBookingsComponent } from './My-Bookings-Component/my-bookings/my-bookings.component';
import { CancelTicketDialogComponent } from './My-Bookings-Component/cancel-ticket-dialog/cancel-ticket-dialog.component';
import { TicketComponent } from './Book-Tickets-Component/ticket/ticket.component';
import { EditEventDialogComponent } from './My-Events-Component/edit-event-dialog/edit-event-dialog.component';
import { FeedbackComponent } from './feedback/feedback.component';
// import { BookEventFormComponent } from './book-event-form/book-event-form.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

  { path: 'edit-event-dialog', component: EditEventDialogComponent, canActivate: [AuthGuard]},
  { path: 'sidebar', component: SidebarComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ticket', component: TicketComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'my-bookings', component: MyBookingsComponent,  canActivate: [AuthGuard]},
  { path: 'cancel-ticket-dialog', component: CancelTicketDialogComponent, canActivate: [AuthGuard]},
  { path: 'book-tickets-dialog', component: BookTicketDialogComponent,  canActivate: [AuthGuard]},
  { path: 'book-tickets', component: BookTicketsComponent, canActivate: [AuthGuard]},
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard]},
  { path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard]}
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])) // <-- attach here
  ]
};
