export interface Match {
  id?:           number;
  tournament:    number;
  team_a:        number;
  team_a_name?:  string;
  team_b:        number;
  team_b_name?:  string;
  score_a?:      number;
  score_b?:      number;
  status:        'scheduled' | 'ongoing' | 'finished';
  scheduled_at?: string;
}