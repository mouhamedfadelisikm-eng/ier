import { User } from './user.model';
import { ZoneSummary } from './signalement.model';

export interface Equipe {
  id: number;
  nom_equipe: string;
  description?: string | null;
  agents?: User[];
  zones?: ZoneSummary[];
  created_at?: string;
  updated_at?: string;
}

export interface EquipePage {
  data: Equipe[];
  meta?: {
    current_page:number; from:number; last_page:number; per_page:number; to:number; total:number;
  };
}

export interface EquipePayload {
  nom_equipe: string;
  description?: string | null;
  agent_ids?: number[];
}
