import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/Core/config/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
