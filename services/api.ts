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

export interface ColorDetectionData {
  colorName: string;
  colorCategory: string;
  rgb: [number, number, number];
  hex: string;
  hsl: [number, number, number];
  confidence: number;
  palette?: Array<{
    name: string;
    category: string;
    rgb: [number, number, number];
    percentage: number;
  }>;
}

export interface RecommendationData {
  colorName: string;
  colorCategory: string;
  recommendations: Array<{
    strategy: string;
    description: string;
    tips: string[];
  }>;
}

export interface SaveDetectionResponse {
  success: boolean;
  detectionId: string;
  message: string;
}

export interface SaveRecommendationsResponse {
  success: boolean;
  recommendationId: string;
  message: string;
}

export interface ColorHistoryResponse {
  success: boolean;
  colorHistory: Array<{
    id: string;
    userId: string;
    colorName: string;
    colorCategory: string;
    rgb: [number, number, number];
    hex: string;
    hsl: [number, number, number];
    confidence: number;
    palette: Array<{
      name: string;
      category: string;
      rgb: [number, number, number];
      percentage: number;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  hasMore: boolean;
  lastDocId: string | null;
  message: string;
}

export interface RecommendationHistoryResponse {
  success: boolean;
  recommendationHistory: Array<{
    id: string;
    userId: string;
    colorName: string;
    colorCategory: string;
    recommendations: Array<{
      strategy: string;
      description: string;
      tips: string[];
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  hasMore: boolean;
  lastDocId: string | null;
  message: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
    console.log('🔐 Token actualizado:', token ? `${token.substring(0, 20)}...` : 'null');
  }

  getToken(): string | null {
    return this.token;
  }

  isTokenValid(): boolean {
    return !!this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log(`🔐 Token configurado: ${this.token.substring(0, 20)}...`);
    } else {
      console.log('⚠️ No hay token configurado');
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        
        // Si es un error 401, el token puede estar expirado
        if (response.status === 401) {
          console.log('🔐 Token expirado o inválido, limpiando...');
          this.setToken(null);
        }
        
        // Crear un error personalizado que preserve el código y mensaje del backend
        const error = new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).code = errorData.code;
        (error as any).status = response.status;
        (error as any).details = errorData.details;
        throw error;
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error: any) {
      console.error('🚨 Network/API error:', error);
      
      // Si es un error de red, envolver con información específica
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('No se pudo conectar con el servidor');
        (networkError as any).code = 'NETWORK_ERROR';
        (networkError as any).status = 0;
        throw networkError;
      }
      
      // Re-lanzar el error con su información original
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

  async changePassword(currentPassword: string, newPassword: string): Promise<{ ok: boolean; message: string }> {
    return this.request<{ ok: boolean; message: string }>('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Color detection endpoints
  async saveColorDetection(data: ColorDetectionData): Promise<SaveDetectionResponse> {
    return this.request<SaveDetectionResponse>('/color-detection/save-detection', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async saveRecommendations(data: RecommendationData): Promise<SaveRecommendationsResponse> {
    return this.request<SaveRecommendationsResponse>('/color-detection/save-recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getColorDetectionHistory(limit: number = 20, lastDocId?: string): Promise<ColorHistoryResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (lastDocId) {
      params.append('lastDocId', lastDocId);
    }
    return this.request<ColorHistoryResponse>(`/color-detection/history?${params.toString()}`);
  }

  async getRecommendationHistory(limit: number = 20, lastDocId?: string): Promise<RecommendationHistoryResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (lastDocId) {
      params.append('lastDocId', lastDocId);
    }
    return this.request<RecommendationHistoryResponse>(`/color-detection/recommendations/history?${params.toString()}`);
  }

  async getColorDetectionById(id: string): Promise<{ success: boolean; detection: any; message: string }> {
    return this.request<{ success: boolean; detection: any; message: string }>(`/color-detection/detection/${id}`);
  }

  async deleteColorDetection(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/color-detection/detection/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteRecommendation(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/color-detection/recommendation/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ ok: boolean; service: string }> {
    return this.request<{ ok: boolean; service: string }>('/health');
  }
}

export const apiService = new ApiService();
