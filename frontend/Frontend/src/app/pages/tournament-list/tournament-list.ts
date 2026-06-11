import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament';
import { AuthService } from '../../services/auth';
import { Tournament } from '../../models/tournament';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tournament-list.html',
  styleUrls: ['./tournament-list.css']
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  isLoading = true;
  errorMsg  = '';
  searchTerm = '';

  constructor(
    private tournamentService: TournamentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTournaments();
  }

  loadTournaments() {
    this.isLoading = true;
    this.tournamentService.getAll().subscribe({
      next: (data) => {
        this.tournaments = data;
        this.isLoading   = false;
      },
      error: () => {
        this.errorMsg  = 'Erreur lors du chargement.';
        this.isLoading = false;
      }
    });
  }

  get filtered() {
    if (!this.searchTerm) return this.tournaments;
    return this.tournaments.filter(t =>
      t.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteTournament(id: number) {
    if (!confirm('Supprimer ce tournoi ?')) return;
    this.tournamentService.delete(id).subscribe({
      next: () => this.loadTournaments(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

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

  logout() { this.authService.logout(); }
}