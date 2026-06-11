import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './team-list.html',
  styleUrls: ['./team-list.css']
})
export class TeamListComponent implements OnInit {
  teams:      Team[]       = [];
  tournament: Tournament | null = null;
  isLoading   = true;
  errorMsg    = '';
  successMsg  = '';
  showForm    = false;
  editingTeam: Team | null = null;

  form: FormGroup;
  tournamentId!: number;

  constructor(
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
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
        this.teams     = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg  = 'Erreur chargement équipes.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm(team?: Team) {
    this.showForm    = true;
    this.editingTeam = team || null;
    this.successMsg  = '';
    this.errorMsg    = '';
    if (team) {
      this.form.patchValue({ name: team.name });
    } else {
      this.form.reset();
    }
  }

  closeForm() {
    this.showForm    = false;
    this.editingTeam = null;
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: Team = {
      name:       this.form.value.name,
      tournament: this.tournamentId
    };

    if (this.editingTeam) {
      this.teamService.update(this.editingTeam.id!, data).subscribe({
        next: () => {
          this.successMsg = 'Équipe modifiée !';
          this.closeForm();
          this.loadTeams();
        },
        error: (err) => {
          this.errorMsg = err.error?.name?.[0] || 'Erreur modification.';
        }
      });
    } else {
      this.teamService.create(data).subscribe({
        next: () => {
          this.successMsg = 'Équipe ajoutée !';
          this.closeForm();
          this.loadTeams();
        },
        error: (err) => {
          this.errorMsg = err.error?.name?.[0] || 'Erreur création.';
        }
      });
    }
  }

  deleteTeam(id: number) {
    if (!confirm('Supprimer cette équipe ?')) return;
    this.teamService.delete(id).subscribe({
      next: () => this.loadTeams(),
      error: () => alert('Erreur suppression.')
    });
  }

  goToMatches() {
    this.router.navigate(['/tournaments', this.tournamentId, 'matches']);
  }
}