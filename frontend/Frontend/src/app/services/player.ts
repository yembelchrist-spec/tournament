import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  private url = `${environment.apiUrl}/players/`;

  constructor(private http: HttpClient) {}

  getByTeam(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.url}?team=${teamId}`);
  }

  create(data: Player): Observable<Player> {
    return this.http.post<Player>(this.url, data);
  }

  update(id: number, data: Player): Observable<Player> {
    return this.http.put<Player>(`${this.url}${id}/`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
}