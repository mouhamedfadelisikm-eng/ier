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

export interface TypeDechetItem {
  id: number;
  libelle: string;
  description?: string;
  pivot?: {
    signalement_id: number;
    type_dechet_id: number;
    quantite_estime?: number;
    volume_estime?: number;
    dangerosite?: string;
    remarque?: string;
  };
}

export interface SignalementPhoto {
  id: number;
  url: string;
  description?: string;
}

export interface Signalement {
  id: number;
  description: string;
  latitude: number;
  longitude: number;
  statut: string;
  priorite?: string | null;
  user?: UserSummary;
  zone?: ZoneSummary;
  type_dechets?: TypeDechetItem[];
  photos?: SignalementPhoto[];
  created_at?: string;
  date_heure_signalement?: string;
  updated_at?: string;
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
