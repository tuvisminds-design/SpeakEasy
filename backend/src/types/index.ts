export interface User {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Conversation {
  id: number;
  user_id: number;
  topic: string;
  speech_type: 'impromptu' | 'planned';
  duration: number;
  ai_provider: 'openai' | 'claude' | 'gemini';
  speaking_points: string[];
  created_at: Date;
  updated_at: Date;
}

export interface AISettings {
  id: number;
  provider: 'openai' | 'claude' | 'gemini';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface GenerateSpeechRequest {
  topic: string;
  speech_type: 'impromptu' | 'planned';
  duration: number;
}

export interface GenerateSpeechResponse {
  speaking_points: string[];
  ai_provider: string;
  conversation_id: number;
}

export interface ConversationHistoryResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface AISettingsResponse {
  current_provider: string;
  available_providers: Array<{
    provider: string;
    is_active: boolean;
  }>;
}
