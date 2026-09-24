import { Affectation } from './affectation.model';

export type InterventionStatut = 'en_cours' | 'terminee' | 'suspendue';

export interface InterventionPhoto {
  id: number;
  url: string;
  description?: string | null;
}

export interface Intervention {
  id: number;
  date_heure_debut: string;
  date_heure_fin?: string | null;
  statut: InterventionStatut;
  compte_rendu?: string | null;
  observation?: string | null;
  affectation?: Affectation;
  photos?: InterventionPhoto[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateInterventionPayload {
  date_heure_debut: string;
  affectation_id: number;
}

export interface UpdateInterventionPayload {
  date_heure_fin?: string;
  statut?: InterventionStatut;
  compte_rendu?: string | null;
  observation?: string | null;
  photos?: File[];
}

export interface InterventionPage {
  data: Intervention[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}
