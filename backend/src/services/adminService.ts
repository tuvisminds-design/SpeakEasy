import { db } from '../config/database';
import { AISettings, AISettingsResponse } from '../types';

export class AdminService {
  async getAISettings(): Promise<AISettingsResponse> {
    const settings = await db('ai_settings').select('*');
    
    const currentProvider = settings.find(s => s.is_active)?.provider || 'openai';
    
    return {
      current_provider: currentProvider,
      available_providers: settings.map(s => ({
        provider: s.provider,
        is_active: s.is_active,
      })),
    };
  }

  async updateAIProvider(provider: 'openai' | 'claude' | 'gemini'): Promise<void> {
    // First, deactivate all providers
    await db('ai_settings').update({ is_active: false });
    
    // Then activate the selected provider
    const updated = await db('ai_settings')
      .where('provider', provider)
      .update({ is_active: true });

    if (updated === 0) {
      throw new Error(`AI provider '${provider}' not found`);
    }
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalConversations: number;
    conversationsByProvider: Array<{ provider: string; count: number }>;
    recentActivity: Array<{ date: string; count: number }>;
  }> {
    const [totalUsers, totalConversations, providerStats, recentActivity] = await Promise.all([
      db('users').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      db('conversations').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      db('conversations')
        .select('ai_provider')
        .count('* as count')
        .groupBy('ai_provider'),
      db('conversations')
        .select(db.raw('DATE(created_at) as date'))
        .count('* as count')
        .where('created_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 7 DAY)'))
        .groupBy(db.raw('DATE(created_at)'))
        .orderBy('date', 'desc')
    ]);

    return {
      totalUsers,
      totalConversations,
      conversationsByProvider: providerStats.map((s: any) => ({
        provider: s.ai_provider as string,
        count: parseInt(s.count as string),
      })),
      recentActivity: recentActivity.map((a: any) => ({
        date: a.date as string,
        count: parseInt(a.count as string),
      })),
    };
  }
}
