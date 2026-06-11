from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Tournament, Team, Match, Player
from .serializers import (
    TournamentSerializer,
    TeamSerializer,
    MatchSerializer,
    PlayerSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    username = request.data.get('username')
    email    = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username et password requis.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {'username': 'Ce nom d\'utilisateur est déjà pris.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if email and User.objects.filter(email=email).exists():
        return Response(
            {'email': 'Cet email est déjà utilisé.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = User.objects.create_user(
        username=username, email=email, password=password
    )
    return Response(
        {'message': 'Compte créé avec succès.'},
        status=status.HTTP_201_CREATED
    )


class TournamentViewSet(viewsets.ModelViewSet):
    serializer_class   = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tournament.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class   = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Team.objects.all()
        tournament_id = self.request.query_params.get('tournament')
        if tournament_id:
            queryset = queryset.filter(tournament=tournament_id)
        return queryset


class MatchViewSet(viewsets.ModelViewSet):
    serializer_class   = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Match.objects.all()
        tournament_id = self.request.query_params.get('tournament')
        if tournament_id:
            queryset = queryset.filter(tournament=tournament_id)
        return queryset


class PlayerViewSet(viewsets.ModelViewSet):
    serializer_class   = PlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Player.objects.all()
        team_id = self.request.query_params.get('team')
        if team_id:
            queryset = queryset.filter(team=team_id)
        return queryset