import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament';
import { AuthService } from '../../services/auth';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  tournaments: Tournament[] = [];
  isLoading = true;
  errorMsg  = '';

  constructor(
    private tournamentService: TournamentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTournaments();
  }

  loadTournaments() {
    this.isLoading = true;
    this.tournaments = [];
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.tournamentService.getAll().subscribe({
      next: (data) => {
        console.log('DATA RECUE:', data);
        console.log('NOMBRE:' ,data.length);
        this.tournaments = [...data];
        this.isLoading   = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur:', err);
        this.errorMsg = 'Erreur chargement.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalTournaments()    { return this.tournaments.length; }
  get activeTournaments()   { return this.tournaments.filter(t => t.status === 'ongoing').length; }
  get draftTournaments()    { return this.tournaments.filter(t => t.status === 'draft').length; }
  get finishedTournaments() { return this.tournaments.filter(t => t.status === 'finished').length; }

  deleteTournament(id: number) {
    if (!confirm('Supprimer ce tournoi ?')) return;
    this.tournamentService.delete(id).subscribe({
      next: () => this.loadTournaments(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  editTournament(id: number) {
    this.router.navigate(['/tournaments/edit', id]);
  }

  logout() { this.authService.logout(); }

  getStatusLabel(status: string): string {
    const labels: any = {
      draft:    'Brouillon',
      open:     'Inscriptions',
      ongoing:  'En cours',
      finished: 'Terminé'
    };
    return labels[status] || status;
  }

  getFormatLabel(format: string): string {
    const labels: any = {
      elimination:     'Élimination directe',
      round_robin:     'Round Robin',
      groups_playoffs: 'Poules + Playoffs'
    };
    return labels[format] || format;
  }
}