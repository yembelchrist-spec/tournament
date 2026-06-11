import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  private url = `${environment.apiUrl}/teams/`;

  constructor(private http: HttpClient) {}

  getByTournament(tournamentId: number): Observable<Team[]>{
    return this.http.get<Team[]>(`${this.url}?tournament=${tournamentId}`);
  }

  create(data: Team): Observable<Team>{
    return this.http.post<Team>(this.url, data);
  }

  update(id: number, data:Team): Observable<Team>{
    return this.http.put<Team>(`${this.url}${id}/`, data);
  }

  delete(id :number): Observable<any>{
    return this.http.delete(`${this.url}${id}/`);
  } 
}
