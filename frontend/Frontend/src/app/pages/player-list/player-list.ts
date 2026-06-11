import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from '../../services/player';
import { Player } from '../../models/player';
import { Team } from '../../models/team';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './player-list.html',
  styleUrls: ['./player-list.css']
})
export class PlayerListComponent implements OnInit {
  players:      Player[] = [];
  team:         Team | null = null;
  isLoading     = true;
  errorMsg      = '';
  successMsg    = '';
  showForm      = false;
  editingPlayer: Player | null = null;
  teamId!:      number;
  tournamentId!: number;

  form: FormGroup;

  roles = [
    { value: 'coach',   label: 'Coach',       icon: '🧠' },
    { value: 'captain', label: 'Capitaine',   icon: '⭐' },
    { value: 'player',  label: 'Joueur',      icon: '🏃' },
    { value: 'reserve', label: 'Remplaçant',  icon: '🪑' },
    { value: 'manager', label: 'Manager',     icon: '📋' },
  ];

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name:   ['', [Validators.required, Validators.minLength(2)]],
      role:   ['player', Validators.required],
      number: [null]
    });
  }

  ngOnInit() {
    this.teamId = +this.route.snapshot.params['id'];
    console.log('Team ID:', this.teamId);
    this.loadPlayers();
  }

  loadPlayers() {
    this.isLoading = true;
    console.log('Chargement joueurs team:', this.teamId);

    this.playerService.getByTeam(this.teamId).subscribe({
      next: (data) => {
        console.log('Joueurs recus:', DataTransfer.length, data);
        this.players = [...data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur:', err);
        this.errorMsg = 'Erreur chargement joueurs.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get hasCoach():   boolean { return this.players.some(p => p.role === 'coach'); }
  get hasCaptain(): boolean { return this.players.some(p => p.role === 'captain'); }

  get coaches()   { return this.players.filter(p => p.role === 'coach'); }
  get captains()  { return this.players.filter(p => p.role === 'captain'); }
  get mainPlayers(){ return this.players.filter(p => p.role === 'player'); }
  get reserves()  { return this.players.filter(p => p.role === 'reserve'); }
  get managers()  { return this.players.filter(p => p.role === 'manager'); }

  getRoleLabel(role: string): string {
    return this.roles.find(r => r.value === role)?.label || role;
  }

  getRoleIcon(role: string): string {
    return this.roles.find(r => r.value === role)?.icon || '👤';
  }

  openForm(player?: Player) {
    this.showForm      = true;
    this.editingPlayer = player || null;
    this.successMsg    = '';
    this.errorMsg      = '';
    if (player) {
      this.form.patchValue({
        name:   player.name,
        role:   player.role,
        number: player.number || null
      });
    } else {
      this.form.reset({ role: 'player' });
    }
  }

  closeForm() {
    this.showForm      = false;
    this.editingPlayer = null;
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // Vérifie unicité coach et capitaine
    if (v.role === 'coach' && this.hasCoach && !this.editingPlayer) {
      this.errorMsg = 'Il y a déjà un coach dans cette équipe.';
      return;
    }
    if (v.role === 'captain' && this.hasCaptain && !this.editingPlayer) {
      this.errorMsg = 'Il y a déjà un capitaine dans cette équipe.';
      return;
    }

    const data: Player = {
      team:   this.teamId,
      name:   v.name,
      role:   v.role,
      number: v.number || null
    };

    if (this.editingPlayer) {
      this.playerService.update(this.editingPlayer.id!, data).subscribe({
        next: () => {
          this.successMsg = 'Joueur modifié !';
          this.closeForm();
          this.loadPlayers();
        },
        error: (err) => {
          this.errorMsg = err.error?.name?.[0] || 'Erreur modification.';
        }
      });
    } else {
      this.playerService.create(data).subscribe({
        next: () => {
          this.successMsg = 'Joueur ajouté !';
          this.closeForm();
          this.loadPlayers();
        },
        error: (err) => {
          this.errorMsg = err.error?.name?.[0] || 'Erreur création.';
        }
      });
    }
  }

  deletePlayer(id: number) {
    if (!confirm('Supprimer ce joueur ?')) return;
    this.playerService.delete(id).subscribe({
      next: () => this.loadPlayers(),
      error: () => alert('Erreur suppression.')
    });
  }

  goBack() {
    window.history.back();
  }
}