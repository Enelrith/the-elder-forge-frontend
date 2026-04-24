export interface RegisterUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  createdAt: string;
  email: string;
}

export interface AccessJwtResponse {
  accessToken: string;
}

export type LoginResponse = AccessJwtResponse;

export interface Auth {
  email: string;
  password: string;
}
