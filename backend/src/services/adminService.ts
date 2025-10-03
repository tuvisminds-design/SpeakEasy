import { db } from '../config/database';
import { AISettings, AISettingsResponse } from '../types';
import { FeedbackService } from './feedbackService';

export class AdminService {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }
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
        .select(db.raw('date(created_at) as date'))
        .count('* as count')
        .where('created_at', '>=', db.raw("datetime('now', '-7 days')"))
        .groupBy(db.raw('date(created_at)'))
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

  async getUserUsageReport(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    userGrowth: Array<{ date: string; count: number }>;
    userActivity: Array<{ date: string; active_users: number }>;
    averageConversationsPerUser: number;
    topSpeechTypes: Array<{ type: string; count: number; percentage: number }>;
    averageSessionDuration: number;
  }> {
    const [
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newUsersThisMonth,
      userGrowth,
      userActivity,
      conversationStats,
      speechTypeStats,
      avgDuration
    ] = await Promise.all([
      // Total users
      db('users').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      
      // Active users (users with at least one conversation in last 30 days)
      db('users')
        .join('conversations', 'users.id', 'conversations.user_id')
        .where('conversations.created_at', '>=', db.raw("datetime('now', '-30 days')"))
        .countDistinct('users.id as count')
        .first()
        .then(r => parseInt(r?.count as string) || 0),
      
      // New users this week
      db('users')
        .count('* as count')
        .where('created_at', '>=', db.raw("datetime('now', '-7 days')"))
        .first()
        .then(r => parseInt(r?.count as string) || 0),
      
      // New users this month
      db('users')
        .count('* as count')
        .where('created_at', '>=', db.raw("datetime('now', '-30 days')"))
        .first()
        .then(r => parseInt(r?.count as string) || 0),
      
      // User growth over time (last 30 days)
      db('users')
        .select(db.raw('date(created_at) as date'))
        .count('* as count')
        .where('created_at', '>=', db.raw("datetime('now', '-30 days')"))
        .groupBy(db.raw('date(created_at)'))
        .orderBy('date', 'asc'),
      
      // Daily active users (last 30 days)
      db('conversations')
        .select(db.raw('date(created_at) as date'))
        .countDistinct('user_id as active_users')
        .where('created_at', '>=', db.raw("datetime('now', '-30 days')"))
        .groupBy(db.raw('date(created_at)'))
        .orderBy('date', 'asc'),
      
      // Total conversations
      db('conversations').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      
      // Speech type distribution
      db('conversations')
        .select('speech_type')
        .count('* as count')
        .groupBy('speech_type'),
      
      // Average session duration
      db('conversations')
        .avg('duration as avg_duration')
        .first()
        .then(r => parseFloat(r?.avg_duration as string) || 0)
    ]);

    const totalConversations = conversationStats;
    const averageConversationsPerUser = totalUsers > 0 ? totalConversations / totalUsers : 0;

    // Calculate speech type percentages
    const totalSpeechTypeCount = speechTypeStats.reduce((sum: number, s: any) => sum + parseInt(s.count as string), 0);
    const topSpeechTypes = speechTypeStats.map((s: any) => ({
      type: s.speech_type as string,
      count: parseInt(s.count as string),
      percentage: totalSpeechTypeCount > 0 ? (parseInt(s.count as string) / totalSpeechTypeCount) * 100 : 0
    }));

    return {
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newUsersThisMonth,
      userGrowth: userGrowth.map((g: any) => ({
        date: g.date as string,
        count: parseInt(g.count as string),
      })),
      userActivity: userActivity.map((a: any) => ({
        date: a.date as string,
        active_users: parseInt(a.active_users as string),
      })),
      averageConversationsPerUser: Math.round(averageConversationsPerUser * 100) / 100,
      topSpeechTypes,
      averageSessionDuration: Math.round(avgDuration * 100) / 100,
    };
  }

  async getTopUsers(limit: number = 10): Promise<Array<{
    user_id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    total_conversations: number;
    total_duration: number;
    last_activity: string;
    avg_duration: number;
  }>> {
    const topUsers = await db('users')
      .join('conversations', 'users.id', 'conversations.user_id')
      .select(
        'users.id as user_id',
        'users.email',
        'users.first_name',
        'users.last_name',
        db.raw('COUNT(conversations.id) as total_conversations'),
        db.raw('SUM(conversations.duration) as total_duration'),
        db.raw('MAX(conversations.created_at) as last_activity'),
        db.raw('AVG(conversations.duration) as avg_duration')
      )
      .groupBy('users.id', 'users.email', 'users.first_name', 'users.last_name')
      .orderBy('total_conversations', 'desc')
      .limit(limit);

    return topUsers.map((user: any) => ({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      total_conversations: parseInt(user.total_conversations as string),
      total_duration: parseInt(user.total_duration as string),
      last_activity: user.last_activity as string,
      avg_duration: Math.round(parseFloat(user.avg_duration as string) * 100) / 100,
    }));
  }

  async getDetailedAnalytics(): Promise<{
    systemOverview: {
      totalUsers: number;
      totalConversations: number;
      totalMinutes: number;
      averageSessionDuration: number;
    };
    userEngagement: {
      dailyActiveUsers: Array<{ date: string; users: number }>;
      weeklyActiveUsers: Array<{ week: string; users: number }>;
      userRetention: Array<{ cohort: string; retention_rate: number }>;
    };
    contentAnalytics: {
      popularTopics: Array<{ topic: string; count: number }>;
      speechTypeDistribution: Array<{ type: string; count: number; percentage: number }>;
      durationDistribution: Array<{ range: string; count: number }>;
    };
    technicalMetrics: {
      aiProviderUsage: Array<{ provider: string; count: number; percentage: number }>;
      errorRate: number;
      averageResponseTime: number;
    };
  }> {
    const [
      systemOverview,
      dailyActiveUsers,
      weeklyActiveUsers,
      popularTopics,
      speechTypeDistribution,
      durationDistribution,
      aiProviderUsage,
      totalErrors
    ] = await Promise.all([
      // System overview
      db('users')
        .join('conversations', 'users.id', 'conversations.user_id')
        .select(
          db.raw('COUNT(DISTINCT users.id) as total_users'),
          db.raw('COUNT(conversations.id) as total_conversations'),
          db.raw('SUM(conversations.duration) as total_minutes'),
          db.raw('AVG(conversations.duration) as avg_duration')
        )
        .first(),
      
      // Daily active users (last 30 days)
      db('conversations')
        .select(db.raw('date(created_at) as date'))
        .countDistinct('user_id as users')
        .where('created_at', '>=', db.raw("datetime('now', '-30 days')"))
        .groupBy(db.raw('date(created_at)'))
        .orderBy('date', 'asc'),
      
      // Weekly active users (last 12 weeks) - simplified for SQLite
      db('conversations')
        .select(db.raw('strftime("%Y-%W", created_at) as week'))
        .countDistinct('user_id as users')
        .where('created_at', '>=', db.raw("datetime('now', '-84 days')"))
        .groupBy(db.raw('strftime("%Y-%W", created_at)'))
        .orderBy('week', 'asc'),
      
      // Popular topics (top 20)
      db('conversations')
        .select('topic')
        .count('* as count')
        .groupBy('topic')
        .orderBy('count', 'desc')
        .limit(20),
      
      // Speech type distribution
      db('conversations')
        .select('speech_type')
        .count('* as count')
        .groupBy('speech_type'),
      
      // Duration distribution
      db('conversations')
        .select(
          db.raw(`CASE 
            WHEN duration <= 2 THEN '1-2 min'
            WHEN duration <= 5 THEN '3-5 min'
            WHEN duration <= 10 THEN '6-10 min'
            WHEN duration <= 15 THEN '11-15 min'
            ELSE '15+ min'
          END as range`)
        )
        .count('* as count')
        .groupBy(db.raw(`CASE 
          WHEN duration <= 2 THEN '1-2 min'
          WHEN duration <= 5 THEN '3-5 min'
          WHEN duration <= 10 THEN '6-10 min'
          WHEN duration <= 15 THEN '11-15 min'
          ELSE '15+ min'
        END`)),
      
      // AI provider usage
      db('conversations')
        .select('ai_provider')
        .count('* as count')
        .groupBy('ai_provider'),
      
      // Error tracking (placeholder - would need error logging)
      db('conversations').count('* as count').first().then(r => parseInt(r?.count as string) || 0)
    ]);

    // Calculate percentages for distributions
    const totalConversations = parseInt(systemOverview?.total_conversations as string) || 0;
    const totalMinutes = parseInt(systemOverview?.total_minutes as string) || 0;

    const speechTypeWithPercentage = speechTypeDistribution.map((s: any) => {
      const count = parseInt(s.count as string);
      return {
        type: s.speech_type as string,
        count,
        percentage: totalConversations > 0 ? (count / totalConversations) * 100 : 0
      };
    });

    const aiProviderWithPercentage = aiProviderUsage.map((p: any) => {
      const count = parseInt(p.count as string);
      return {
        provider: p.ai_provider as string,
        count,
        percentage: totalConversations > 0 ? (count / totalConversations) * 100 : 0
      };
    });

    return {
      systemOverview: {
        totalUsers: parseInt(systemOverview?.total_users as string) || 0,
        totalConversations,
        totalMinutes,
        averageSessionDuration: Math.round(parseFloat(systemOverview?.avg_duration as string) * 100) / 100 || 0,
      },
      userEngagement: {
        dailyActiveUsers: dailyActiveUsers.map((d: any) => ({
          date: d.date as string,
          users: parseInt(d.users as string),
        })),
        weeklyActiveUsers: weeklyActiveUsers.map((w: any) => ({
          week: w.week as string,
          users: parseInt(w.users as string),
        })),
        userRetention: [], // Would need more complex cohort analysis
      },
      contentAnalytics: {
        popularTopics: popularTopics.map((t: any) => ({
          topic: t.topic as string,
          count: parseInt(t.count as string),
        })),
        speechTypeDistribution: speechTypeWithPercentage,
        durationDistribution: durationDistribution.map((d: any) => ({
          range: d.range as string,
          count: parseInt(d.count as string),
        })),
      },
      technicalMetrics: {
        aiProviderUsage: aiProviderWithPercentage,
        errorRate: 0, // Placeholder
        averageResponseTime: 0, // Placeholder
      },
    };
  }

  async getFeedbackStats(): Promise<{
    totalAppFeedback: number;
    totalResponseFeedback: number;
    averageAppRating: number;
    averageResponseRating: number;
    feedbackByType: Array<{ type: string; count: number }>;
  }> {
    return this.feedbackService.getFeedbackStats();
  }
}
