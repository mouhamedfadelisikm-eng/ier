export type MapPointKind = 'signalement' | 'intervention' | 'equipe' | 'zone' | 'heatmap';

export interface MapPoint {
  id: string | number;
  latitude: number;
  longitude: number;
  kind: MapPointKind;
  label?: string;
  priority?: string | null;
  status?: string | null;
  isNew?: boolean;
  weight?: number;
}
