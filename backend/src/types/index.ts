export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  location?: string;
  website?: string;
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

export interface SendOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface SendOTPResponse {
  message: string;
  expires_in: number;
}

export interface VerifyOTPResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
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

export interface UserProfile {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  location?: string;
  website?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  location?: string;
  website?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  location?: string;
}
