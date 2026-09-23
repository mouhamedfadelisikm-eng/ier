import { SignalementStatut, SignalementPriorite, DangerositeType } from './signalement-constants';

export interface UserSummary {
  id: number;
  nom?: string;
  prenom?: string;
  name?: string;
  email: string;
  telephone?: string;
  role?: string;
}

export interface ZoneSummary {
  id: number;
  nom_zone: string;
  description?: string;
}

export interface TypeDechetPivot {
  type_dechet_id: number;
  quantite_estime?: number | null;
  volume_estime?: number | null;
  dangerosite?: DangerositeType | null;
  remarque?: string | null;
}

export interface TypeDechetItem {
  id: number;
  type_dechet_id?: number;
  libelle: string;
  description?: string;
  quantite_estime?: number | null;
  volume_estime?: number | null;
  dangerosite?: DangerositeType | null;
  remarque?: string | null;
  pivot?: TypeDechetPivot;
}

export interface SignalementPhoto {
  id: number;
  url: string;
  description?: string;
}

export interface Signalement {
  id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  statut: SignalementStatut;
  priorite?: SignalementPriorite | null;
  user?: UserSummary;
  zone?: ZoneSummary;
  type_dechets?: TypeDechetItem[];
  photos?: SignalementPhoto[];
  created_at?: string;
  date_heure_signalement?: string;
  updated_at?: string;
}

export interface UpdateSignalementPayload {
  description?: string | null;
  zone_id?: number | null;
  type_dechets?: Array<{
    type_dechet_id: number;
    quantite_estime?: number | null;
    volume_estime?: number | null;
    dangerosite?: DangerositeType | null;
    remarque?: string | null;
  }>;
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
