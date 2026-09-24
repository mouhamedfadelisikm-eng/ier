export interface ZoneAdmin {
  id:number;
  nom_zone:string;
  description?:string|null;
  created_at?:string;
  updated_at?:string;
}
export interface TypeDechetAdmin {
  id:number;
  libelle:string;
  description?:string|null;
  created_at?:string;
  updated_at?:string;
}
export interface ReferencePage<T>{
  data:T[];
  meta?:{current_page:number;from:number;last_page:number;per_page:number;to:number;total:number};
}
