import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { DisbursementsComponent } from './components/disbursements/disbursements.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'programs', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'disbursements', component: DisbursementsComponent },
      { path: 'reports', component: ReportsComponent },
    ]
  },
  { path: '**', redirectTo: 'programs' }
];
