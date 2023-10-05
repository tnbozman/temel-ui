// projects/shell/src/app/app.routes.ts

import { Routes } from '@angular/router';
// Layouts
import { DefaultLayoutComponent } from '../layouts/default-layout/default-layout.component';
// Pages
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent, pathMatch: 'full' },
      { path: 'not-found', component: NotFoundPageComponent, pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
  // DO NOT insert routes after this one.
  // { path:'**', ...} needs to be the LAST one.
];
