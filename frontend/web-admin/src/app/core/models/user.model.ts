export interface User {
  id: number;
  nom: string;
  prenom: string;
  name?: string;
  email: string;
  telephone?: string | null;
  adresse?: string | null;
  roles?: string[];
  role: 'admin' | 'agent' | 'citizen' | string;
  created_at?: string;
}

export interface UserResponse {
  data: User;
}
