import { Signalement } from './signalement.model';

export interface EquipeSummary {
  id: number;
  nom_equipe: string;
  description?: string;
  zone_id?: number | null;
}

export interface Affectation {
  id: number;
  date_heure_affectation: string;
  observation: string | null;
  equipe?: EquipeSummary;
  signalement?: Signalement;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAffectationPayload {
  date_heure_affectation: string;
  equipe_id: number;
  signalement_id: number;
  observation?: string | null;
}

export interface ReassignAffectationPayload {
  date_heure_affectation: string;
  equipe_id: number;
  observation?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
