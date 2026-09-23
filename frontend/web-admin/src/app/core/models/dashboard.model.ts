export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
  zone_id: number | null;
  zone_nom: string | null;
}
