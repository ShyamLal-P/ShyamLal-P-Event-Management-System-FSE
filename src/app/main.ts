import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

