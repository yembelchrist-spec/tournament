import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TournamentService } from '../../services/tournament';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-tournament-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tournament-form.html',
  styleUrls: ['./tournament-form.css']
})
export class TournamentFormComponent implements OnInit {
  isLoading  = false;
  isSaving   = false;
  errorMsg   = '';
  successMsg = '';
  isEditMode = false;
  tournamentId?: number;

  form : FormGroup

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      format: ['elimination', Validators.required],
      status: ['draft', Validators.required],
      max_teams: [8, [Validators.required, Validators.min(2), Validators.max(64)]],
      start_date: [''],
      location: ['']
    });
  }

  ngOnInit() {
   const id = this.route.snapshot.params['id'];
   console.log('ID récupéré: ', id);

   if(id){
    this.isEditMode = true;
    this.tournamentId = +id;
    this.loadTournament();
   }
  }

  loadTournament() {
    this.isLoading = true;
    console.log('Chargement tournoi ID:', this.tournamentId);

    this.tournamentService.getOne(this.tournamentId!).subscribe({
      next: (t) => {
        console.log('Tournoi chargé:', t);
        this.form.patchValue({
          name: t.name,
          format: t.format,
          status: t.status,
          max_teams: t.max_teams,
          start_date: t.start_date || '',
          location: t.location || ''
        })
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg  = 'Impossible de charger le tournoi.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log ('Formulaire invalide', this.form.errors);
      return;
    }
    this.isSaving  = true;
    this.errorMsg  = '';

    const data: Tournament = this.form.value;
    console.log ('Données envoyées:', data);

    if (this.isEditMode && this.tournamentId) {
      this.tournamentService.update(this.tournamentId!, data).subscribe({
        next: () => {
          this.isSaving   = false;
          this.successMsg = 'Tournoi mis à jour avec succès !';
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMsg = err.error?.name?.[0] || 'Erreur lors de la mise à jour.';
        }
      });
    } else {
      this.tournamentService.create(data).subscribe({
        next: (res) => {
          console.log ('✅Succès', res);
          this.isSaving   = false;
          this.successMsg = 'Tournoi créé avec succès !';
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log ('Erreur:',err);
          this.isSaving = false;
          this.errorMsg = err.error?.name?.[0] || 'Erreur lors de la création.';
        }
      });
    }
  }
}