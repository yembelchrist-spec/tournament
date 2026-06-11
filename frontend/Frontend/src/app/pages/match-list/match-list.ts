import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchService } from '../../services/match';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';
import { Match } from '../../models/match';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './match-list.html',
  styleUrls: ['./match-list.css']
})
export class MatchListComponent implements OnInit {
  matches:    Match[]      = [];
  teams:      Team[]       = [];
  tournament: Tournament | null = null;
  isLoading   = true;
  errorMsg    = '';
  successMsg  = '';
  showForm    = false;
  editingMatch: Match | null = null;

  form: FormGroup;
  scoreForm: FormGroup;
  tournamentId!: number;
  updatingScoreId: number | null = null;

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      team_a:       ['', Validators.required],
      team_b:       ['', Validators.required],
      scheduled_at: [''],
      status:       ['scheduled']
    });

    this.scoreForm = this.fb.group({
      score_a: [0, [Validators.required, Validators.min(0)]],
      score_b: [0, [Validators.required, Validators.min(0)]],
      status:  ['finished']
    });
  }

  ngOnInit() {
    this.tournamentId = +this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.tournamentService.getOne(this.tournamentId).subscribe({
      next: (t) => {
        this.tournament = t;
        this.loadTeams();
      },
      error: () => {
        this.errorMsg  = 'Tournoi introuvable.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadTeams() {
    this.teamService.getByTournament(this.tournamentId).subscribe({
      next: (data) => {
        this.teams = data;
        this.loadMatches();
      },
      error: () => {
        this.errorMsg  = 'Erreur chargement équipes.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMatches() {
    this.matchService.getByTournament(this.tournamentId).subscribe({
      next: (data) => {
        this.matches   = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg  = 'Erreur chargement matchs.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm(match?: Match) {
    this.showForm     = true;
    this.editingMatch = match || null;
    this.successMsg   = '';
    this.errorMsg     = '';
    if (match) {
      this.form.patchValue({
        team_a:       match.team_a,
        team_b:       match.team_b,
        scheduled_at: match.scheduled_at || '',
        status:       match.status
      });
    } else {
      this.form.reset({ status: 'scheduled' });
    }
  }

  closeForm() {
    this.showForm     = false;
    this.editingMatch = null;
    this.form.reset();
  }

  openScoreForm(match: Match) {
    this.updatingScoreId = match.id!;
    this.scoreForm.patchValue({
      score_a: match.score_a || 0,
      score_b: match.score_b || 0,
      status:  'finished'
    });
  }

  closeScoreForm() {
    this.updatingScoreId = null;
    this.scoreForm.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    if (v.team_a === v.team_b) {
      this.errorMsg = 'Les deux équipes doivent être différentes.';
      return;
    }

    const data: Match = {
      tournament:   this.tournamentId,
      team_a:       +v.team_a,
      team_b:       +v.team_b,
      scheduled_at: v.scheduled_at || null,
      status:       v.status || 'scheduled'
    };

    if (this.editingMatch) {
      this.matchService.update(this.editingMatch.id!, data).subscribe({
        next: () => {
          this.successMsg = 'Match modifié !';
          this.closeForm();
          this.loadMatches();
        },
        error: (err) => {
          this.errorMsg = err.error?.non_field_errors?.[0] || 'Erreur modification.';
        }
      });
    } else {
      this.matchService.create(data).subscribe({
        next: () => {
          this.successMsg = 'Match créé !';
          this.closeForm();
          this.loadMatches();
        },
        error: (err) => {
          this.errorMsg = err.error?.non_field_errors?.[0] || 'Erreur création.';
        }
      });
    }
  }

  updateScore(matchId: number) {
    if (this.scoreForm.invalid) return;

    const data = this.scoreForm.value;
    const match = this.matches.find(m => m.id === matchId)!;

    const updated: Match = {
      ...match,
      score_a: +data.score_a,
      score_b: +data.score_b,
      status:  data.status
    };

    this.matchService.update(matchId, updated).subscribe({
      next: () => {
        this.successMsg      = 'Score mis à jour !';
        this.updatingScoreId = null;
        this.loadMatches();
      },
      error: () => {
        this.errorMsg = 'Erreur mise à jour score.';
      }
    });
  }

  deleteMatch(id: number) {
    if (!confirm('Supprimer ce match ?')) return;
    this.matchService.delete(id).subscribe({
      next: () => this.loadMatches(),
      error: () => alert('Erreur suppression.')
    });
  }

  getTeamName(id: number): string {
    return this.teams.find(t => t.id === id)?.name || 'Équipe inconnue';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      scheduled: 'Planifié',
      ongoing:   'En cours',
      finished:  'Terminé'
    };
    return labels[status] || status;
  }

  goToTeams() {
    this.router.navigate(['/tournaments', this.tournamentId, 'teams']);
  }
}