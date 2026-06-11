import { Team } from './team';

export interface Tournament {
  id?:         number;
  owner?:      string;
  name:        string;
  format:      'elimination' | 'round_robin' | 'groups_playoffs';
  status:      'draft' | 'open' | 'ongoing' | 'finished';
  max_teams:   number;
  start_date?: string;
  location?:   string;
  created_at?: string;
  nb_teams?:   number;
  teams?:      Team[];
}