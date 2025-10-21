import { API_BASE_URL } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  uid: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  uid: string;
  email: string;
  name: string;
  username: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (this.token) {
      console.log('Token presente:', this.token.substring(0, 20) + '...');
    } else {
      console.log('Sin token');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(uid: string): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ uid }),
    });
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(data: Partial<Pick<User, 'name' | 'username'>>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('/users/me', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ ok: boolean; service: string }> {
    return this.request<{ ok: boolean; service: string }>('/health');
  }
}

export const apiService = new ApiService();
