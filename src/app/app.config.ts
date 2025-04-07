import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor'; // <-- import
import { AddEventComponent } from './add-event/add-event.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { BookTicketsComponent } from './book-tickets/book-tickets.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
