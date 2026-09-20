export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdatePayload {
  username?: string;
  email?: string;
}

export interface UserPreferences {
  default_scan_type: "quick" | "full";
  theme?: string;
  updated_at?: string;
}

export interface UserPreferencesUpdatePayload {
  default_scan_type?: "quick" | "full";
  theme?: string;
}


export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

