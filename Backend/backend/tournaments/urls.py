from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TournamentViewSet,
    TeamViewSet,
    MatchViewSet,
    PlayerViewSet,
    register_view
)

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'teams',       TeamViewSet,       basename='team')
router.register(r'matches',     MatchViewSet,      basename='match')
router.register(r'players',     PlayerViewSet,     basename='player')

urlpatterns = [
    path('auth/register/', register_view, name='register'),
    path('', include(router.urls)),
]