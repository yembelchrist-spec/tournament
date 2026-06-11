import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { TournamentListComponent } from './pages/tournament-list/tournament-list';
import { TournamentFormComponent } from './pages/tournament-form/tournament-form';
import { authGuard } from './guards/auth-guard';
import { TeamListComponent } from './pages/team-list/team-list';
import { MatchListComponent } from './pages/match-list/match-list';
import { PlayerListComponent } from './pages/player-list/player-list';

export const routes: Routes = [
  { path: '',         component: HomeComponent },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments',
    component: TournamentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments/new',
    component: TournamentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments/edit/:id',
    component: TournamentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments/:id/teams',
    component: TeamListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tournaments/:id/matches',
    component: MatchListComponent,
    canActivate: [authGuard]
  },
  {
  path: 'teams/:id/players',
  component: PlayerListComponent,
  canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }

];