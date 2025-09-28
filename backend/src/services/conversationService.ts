import { db } from '../config/database';
import { Conversation, GenerateSpeechRequest, GenerateSpeechResponse, ConversationHistoryResponse } from '../types';
import { AIProviderService } from './aiProviders';

export class ConversationService {
  private aiProviderService: AIProviderService;

  constructor() {
    this.aiProviderService = new AIProviderService();
  }

  async generateSpeech(
    userId: number,
    request: GenerateSpeechRequest
  ): Promise<GenerateSpeechResponse> {
    // Get the active AI provider
    const activeProvider = await this.getActiveAIProvider();
    
    // Generate speaking points using AI
    const aiResponse = await this.aiProviderService.generateSpeech(
      {
        topic: request.topic,
        speechType: request.speech_type,
        duration: request.duration,
      },
      activeProvider
    );

    // Save conversation to database
    const [conversation] = await db('conversations').insert({
      user_id: userId,
      topic: request.topic,
      speech_type: request.speech_type,
      duration: request.duration,
      ai_provider: activeProvider,
      speaking_points: JSON.stringify(aiResponse.speakingPoints),
    }).returning('*');

    return {
      speaking_points: aiResponse.speakingPoints,
      ai_provider: aiResponse.provider,
      conversation_id: conversation.id,
    };
  }

  async getConversationHistory(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ConversationHistoryResponse> {
    const offset = (page - 1) * limit;

    const [conversations, totalCount] = await Promise.all([
      db('conversations')
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
        .select('*'),
      db('conversations')
        .where('user_id', userId)
        .count('* as count')
        .first()
        .then(result => parseInt(result?.count as string) || 0)
    ]);

    // Parse speaking points from JSON
    const parsedConversations = conversations.map(conv => ({
      ...conv,
      speaking_points: JSON.parse(conv.speaking_points),
    }));

    return {
      conversations: parsedConversations,
      total: totalCount,
      page,
      limit,
    };
  }

  async getConversationById(conversationId: number, userId: number): Promise<Conversation | null> {
    const conversation = await db('conversations')
      .where('id', conversationId)
      .where('user_id', userId)
      .first();

    if (!conversation) {
      return null;
    }

    return {
      ...conversation,
      speaking_points: JSON.parse(conversation.speaking_points),
    };
  }

  async deleteConversation(conversationId: number, userId: number): Promise<boolean> {
    const deletedCount = await db('conversations')
      .where('id', conversationId)
      .where('user_id', userId)
      .del();

    return deletedCount > 0;
  }

  async getConversationStats(userId: number): Promise<{
    totalConversations: number;
    impromptuCount: number;
    plannedCount: number;
    totalMinutes: number;
  }> {
    const stats = await db('conversations')
      .where('user_id', userId)
      .select(
        db.raw('COUNT(*) as total_conversations'),
        db.raw('SUM(CASE WHEN speech_type = ? THEN 1 ELSE 0 END) as impromptu_count', ['impromptu']),
        db.raw('SUM(CASE WHEN speech_type = ? THEN 1 ELSE 0 END) as planned_count', ['planned']),
        db.raw('SUM(duration) as total_minutes')
      )
      .first();

    return {
      totalConversations: parseInt(stats?.total_conversations as string) || 0,
      impromptuCount: parseInt(stats?.impromptu_count as string) || 0,
      plannedCount: parseInt(stats?.planned_count as string) || 0,
      totalMinutes: parseInt(stats?.total_minutes as string) || 0,
    };
  }

  private async getActiveAIProvider(): Promise<'openai' | 'claude' | 'gemini'> {
    const activeProvider = await db('ai_settings')
      .where('is_active', true)
      .first();

    if (!activeProvider) {
      throw new Error('No active AI provider configured');
    }

    return activeProvider.provider;
  }
}
