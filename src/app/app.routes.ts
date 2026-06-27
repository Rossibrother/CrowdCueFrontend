import { Routes } from '@angular/router';
import { DJViewComponent } from './dj-view/dj-view.component';
import { CrowdViewComponent } from './crowd-view/crowd-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dj-view/:queueId', component: DJViewComponent },
  { path: 'crowd-view/:queueId', component: CrowdViewComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
