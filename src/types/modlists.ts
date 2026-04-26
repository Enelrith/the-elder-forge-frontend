import type { User } from './auth';

export interface Modlist {
  id: string;
  createdAt: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  user: User;
  mods: Mod[];
  plugins: Plugin[];
}

export interface ModlistInfo {
  id: string;
  createdAt: string;
  name: string;
  isPublic: boolean;
}

export interface AddModlist {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface Category {
  id: string;
  createdAt: string;
  nexusId: number;
  name: string;
}

export interface Mod {
  id: string;
  createdAt: string;
  name: string;
  notes: string | null;
  priority: number;
  category: Category | null;
  nexusId: string | null;
}

export interface Plugin {
  id: string;
  createdAt: string;
  name: string;
  priority: number;
  mod: Mod | null;
}
