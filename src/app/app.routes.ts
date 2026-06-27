import { Routes } from '@angular/router';
import { DJViewComponent } from './dj-view/dj-view.component';
import { CrowdViewComponent } from './crowd-view/crowd-view.component';

export const routes: Routes = [
  { path: 'dj-view', component: DJViewComponent },
  { path: 'crowd-view', component: CrowdViewComponent },
  { path: '', redirectTo: '/dj-view', pathMatch: 'full' }
];
