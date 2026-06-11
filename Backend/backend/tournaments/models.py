from django.db import models
from django.contrib.auth.models import User


class Tournament(models.Model):
    FORMAT_CHOICES = [
        ('elimination', 'Élimination directe'),
        ('round_robin', 'Round Robin'),
        ('groups_playoffs', 'Poules + Playoffs'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('open', 'Inscriptions ouvertes'),
        ('ongoing', 'En cours'),
        ('finished', 'Terminé'),
    ]

    owner        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    name         = models.CharField(max_length=150)
    format       = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='elimination')
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    max_teams    = models.PositiveIntegerField(default=8)
    start_date   = models.DateField(null=True, blank=True)
    location     = models.CharField(max_length=200, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Team(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    name       = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.tournament.name})"


class Match(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Planifié'),
        ('ongoing', 'En cours'),
        ('finished', 'Terminé'),
    ]

    tournament  = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    team_a      = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_a')
    team_b      = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_b')
    score_a     = models.PositiveIntegerField(null=True, blank=True)
    score_b     = models.PositiveIntegerField(null=True, blank=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    scheduled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.team_a} vs {self.team_b}"
    
class Player(models.Model):
    ROLE_CHOICES = [
        ('coach',    'Coach'),
        ('captain',  'Capitaine'),
        ('player',   'Joueur'),
        ('reserve',  'Remplaçant'),
        ('manager',  'Manager'),
    ]

    team       = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players')
    name       = models.CharField(max_length=100)
    role       = models.CharField(max_length=20, choices=ROLE_CHOICES, default='player')
    number     = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.role} ({self.team.name})"