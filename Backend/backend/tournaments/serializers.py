from rest_framework import serializers
from .models import Tournament, Team, Match, Player


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Team
        fields = ['id', 'name', 'tournament', 'created_at']
        read_only_fields = ['created_at']

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Le nom doit contenir au moins 2 caractères.")
        return value


class MatchSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source='team_a.name', read_only=True)
    team_b_name = serializers.CharField(source='team_b.name', read_only=True)

    class Meta:
        model  = Match
        fields = ['id', 'tournament', 'team_a', 'team_a_name',
                  'team_b', 'team_b_name', 'score_a', 'score_b',
                  'status', 'scheduled_at']

    def validate(self, data):
        if data.get('team_a') == data.get('team_b'):
            raise serializers.ValidationError("Une équipe ne peut pas jouer contre elle-même.")
        return data


class TournamentSerializer(serializers.ModelSerializer):
    owner    = serializers.ReadOnlyField(source='owner.username')
    teams    = TeamSerializer(many=True, read_only=True)
    nb_teams = serializers.IntegerField(source='teams.count', read_only=True)

    class Meta:
        model  = Tournament
        fields = ['id', 'owner', 'name', 'format', 'status',
                  'max_teams', 'start_date', 'location',
                  'created_at', 'teams', 'nb_teams']
        read_only_fields = ['created_at']

    def validate_start_date(self,value):
        if value== '' or value is None:
            return None
        return value

    def validate_max_teams(self, value):
        if value < 2:
            raise serializers.ValidationError("Il faut au moins 2 équipes.")
        if value > 64:
            raise serializers.ValidationError("Maximum 64 équipes par tournoi.")
        return value
    
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'team', 'name', 'role', 'number', 'created_at']
        read_only_fields = ['created_at']

    def validate_name(self,value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Minimum 2 caractères.")
        return value