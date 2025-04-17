import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from '../../features/auth/login/login.component';
import { RegisterComponent } from '../../features/auth/register/register.component';
import { LandingComponent } from '../../features/landing/landing.component';
import { HomeComponent } from '../../features/home/home.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AddEventComponent } from '../../features/add-event/add-event.component';
import { MyEventsComponent } from '../../features/my-events/my-events/my-events.component';
import { BookTicketDialogComponent } from '../../features/book-tickets/book-ticket-dialog/book-ticket-dialog.component';
import { BookTicketsComponent } from '../../features/book-tickets/book-tickets/book-tickets.component';
import { MyBookingsComponent } from '../../features/my-bookings/my-bookings/my-bookings.component';
import { CancelTicketDialogComponent } from '../../features/my-bookings/cancel-ticket-dialog/cancel-ticket-dialog.component';
import { TicketComponent } from '../../features/book-tickets/ticket/ticket.component';
import { EditEventDialogComponent } from '../../features/my-events/edit-event-dialog/edit-event-dialog.component';
import { NotificationsComponent } from '../../features/notifications/notifications.component';
import { ProfileComponent } from '../../features/profile/profile.component';
import { ViewFeedbackDialogComponent } from '../../features/my-events/view-feedback-dialog/view-feedback-dialog.component';
import { FeedbackComponent } from '../../features/feedback/feedback/feedback.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'edit-event-dialog', component: EditEventDialogComponent, canActivate: [AuthGuard]},
  { path: 'sidebar', component: SidebarComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'view-feedback-dialog', component: ViewFeedbackDialogComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'feedback-dialog', component: FeedbackComponent, canActivate: [AuthGuard] },
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
