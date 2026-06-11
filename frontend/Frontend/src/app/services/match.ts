import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {

  private url = `${environment.apiUrl}/matches/`

  constructor(private http: HttpClient) {}

  getByTournament(tournamentId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.url}?tournament=${tournamentId}`);
  }

   create(data: Match): Observable<Match>{
      return this.http.post<Match>(this.url, data);
    }
  
    update(id: number, data:Match): Observable<Match>{
      return this.http.put<Match>(`${this.url}${id}/`, data);
    }
  
    delete(id :number): Observable<any>{
      return this.http.delete(`${this.url}${id}/`);
    } 
}
