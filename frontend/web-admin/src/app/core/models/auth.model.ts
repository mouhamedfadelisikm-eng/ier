import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
}

export interface AuthResponse {
  data: AuthData;
}
