import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const router      = inject(Router);
  const token = localStorage.getItem('access_token');

  console.log('Guard - token:', token ? 'OK' : 'NULL');

  if (token) {
    return true;
  }

  // Redirige vers la page d'accueil si non connecté
  router.navigate(['/login']);
  return false;
};