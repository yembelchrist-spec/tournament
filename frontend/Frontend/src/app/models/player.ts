export interface Player {
  id?:         number;
  team:        number;
  name:        string;
  role:        'coach' | 'captain' | 'player' | 'reserve' | 'manager';
  number?:     number;
  created_at?: string;
}