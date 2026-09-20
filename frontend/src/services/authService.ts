import api from "./api";
import type {
  RegisterPayload,
  LoginPayload,
  TokenResponse,
  User,
  UserProfileUpdatePayload,
  UserPreferences,
  UserPreferencesUpdatePayload,
} from "@/types/user";

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post<User>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<TokenResponse> {
    // Backend expects OAuth2 password flow: x-www-form-urlencoded, not JSON.
    const form = new URLSearchParams();
    form.append("username", payload.username);
    form.append("password", payload.password);

    const { data } = await api.post<TokenResponse>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  async updateProfile(payload: UserProfileUpdatePayload): Promise<User> {
    const { data } = await api.patch<User>("/auth/me", payload);
    return data;
  },

  async getPreferences(): Promise<UserPreferences> {
    const { data } = await api.get<UserPreferences>("/auth/preferences");
    return data;
  },

  async updatePreferences(payload: UserPreferencesUpdatePayload): Promise<UserPreferences> {
    const { data } = await api.patch<UserPreferences>("/auth/preferences", payload);
    return data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/auth/reset-password", {
      token,
      new_password,
    });
    return data;
  },

  async changePassword(current_password: string, new_password: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/auth/change-password", {
      current_password,
      new_password,
    });
    return data;
  },
};




