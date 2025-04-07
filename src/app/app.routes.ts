import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { BookTicketsComponent } from './book-tickets/book-tickets.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'home', component: HomeComponent },
  { path: 'my-events', component: MyEventsComponent},
  { path: 'book-tickets', component: BookTicketsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the landing page
];
