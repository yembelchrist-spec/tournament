from django.contrib import admin
from .models import Tournament, Team, Match, Player


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display  = ('name', 'owner', 'format', 'status', 'max_teams', 'start_date')
    list_filter   = ('status', 'format')
    search_fields = ('name', 'owner__username')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display  = ('name', 'tournament')
    search_fields = ('name',)
    list_filter   = ('tournament',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display  = ('__str__', 'tournament', 'status', 'scheduled_at')
    list_filter   = ('status', 'tournament')

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'number', 'team')
    list_filter = ('role', 'team')
    search_fields = ('name',)