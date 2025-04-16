import { Routes } from '@angular/router';
import { LandingComponent } from '../../features/landing/landing.component';
import { LoginComponent } from '../../features/auth/login/login.component';
import { AddEventComponent } from '../../features/add-event/add-event.component';
import { EditEventDialogComponent } from '../../features/my-events/edit-event-dialog/edit-event-dialog.component';
import { RegisterComponent } from '../../features/auth/register/register.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FeedbackComponent } from '../../features/feedback/feedback/feedback.component';
import { NotificationsComponent } from '../../features/notifications/notifications.component';
import { ViewFeedbackDialogComponent } from '../../features/my-events/view-feedback-dialog/view-feedback-dialog.component';
import { HomeComponent } from '../../features/home/home.component';
import { ProfileComponent } from '../../features/profile/profile.component';
import { BookTicketDialogComponent } from '../../features/book-tickets/book-ticket-dialog/book-ticket-dialog.component';
import { BookTicketsComponent } from '../../features/book-tickets/book-tickets/book-tickets.component';
import { TicketComponent } from '../../features/book-tickets/ticket/ticket.component';
import { MyEventsComponent } from '../../features/my-events/my-events/my-events.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'edit-event-dialog', component: EditEventDialogComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'feedback', component: FeedbackComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'view-feedback-dialog', component: ViewFeedbackDialogComponent},
  { path: 'notifications', component: NotificationsComponent},
  { path: 'feedback-dialog', component: FeedbackComponent },
  { path: 'book-tickets-dialog', component: BookTicketDialogComponent},
  { path: 'my-events', component: MyEventsComponent},
  { path: 'ticket', component: TicketComponent },
  { path: 'book-tickets', component: BookTicketsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the landing page
];
