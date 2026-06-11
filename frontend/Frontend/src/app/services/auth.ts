import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginUrl  = `${environment.apiUrl}/auth/login/`;
  private refreshUrl = `${environment.apiUrl}/auth/refresh/`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      tap((tokens: any) => {
        console.log('Tokens reçus :', tokens);
        localStorage.setItem('access_token',  tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post(this.refreshUrl, { refresh }).pipe(
      tap((tokens: any) => {
        localStorage.setItem('access_token', tokens.access);
      })
    );
  }
}