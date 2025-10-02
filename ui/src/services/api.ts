const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async sendOTP(email: string) {
    return await this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string) {
    const result = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    this.setToken(result.token);
    return result;
  }

  // Profile Management
  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Speech Generation
  async generateSpeech(topic: string, speechType: 'impromptu' | 'planned', duration: number) {
    return this.request('/conversations/generate', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        speech_type: speechType,
        duration,
      }),
    });
  }

  // Conversation History
  async getConversationHistory(page = 1, limit = 10) {
    return this.request(`/conversations/history?page=${page}&limit=${limit}`);
  }

  async getConversationStats() {
    return this.request('/conversations/stats/overview');
  }

  async deleteConversation(id: number) {
    return this.request(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin functions
  async getAISettings() {
    return this.request('/admin/ai-settings');
  }

  async updateAIProvider(provider: 'openai' | 'claude' | 'gemini') {
    return this.request('/admin/ai-provider', {
      method: 'PUT',
      body: JSON.stringify({ provider }),
    });
  }
}

export const apiService = new ApiService();
