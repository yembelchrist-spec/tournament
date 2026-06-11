import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TournamentService {

  private url = `${environment.apiUrl}/tournaments/`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.url);
  }

  getOne(id: number): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.url}${id}/`);
  }

  create(data: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(this.url, data);
  }

  update(id: number, data: Tournament): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.url}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
}