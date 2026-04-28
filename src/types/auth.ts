export interface RegisterUser {
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: string;
  createdAt: string;
  email: string;
  username: string;
}

export interface UserInfo {
  email: string;
  username: string;
}

export interface Auth {
  email: string;
  password: string;
}

export interface SessionAuth {
  email: string;
  username: string;
}
