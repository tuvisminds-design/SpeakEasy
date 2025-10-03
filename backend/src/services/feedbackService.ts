import { db } from '../config/database';
import { 
  AppFeedback, 
  ResponseFeedback, 
  SubmitAppFeedbackRequest, 
  SubmitResponseFeedbackRequest 
} from '../types';

export class FeedbackService {
  async submitAppFeedback(
    userEmail: string,
    request: SubmitAppFeedbackRequest
  ): Promise<AppFeedback> {
    const [feedback] = await db('app_feedback').insert({
      user_email: userEmail,
      feedback_text: request.feedback_text,
      rating: request.rating,
      feedback_type: request.feedback_type || 'general',
    }).returning('*');

    return feedback;
  }

  async submitResponseFeedback(
    userEmail: string,
    request: SubmitResponseFeedbackRequest
  ): Promise<ResponseFeedback> {
    // Check if conversation exists and belongs to user
    const conversation = await db('conversations')
      .join('users', 'conversations.user_id', 'users.id')
      .where('conversations.id', request.conversation_id)
      .where('users.email', userEmail)
      .first();

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Check if feedback already exists for this conversation
    const existingFeedback = await db('response_feedback')
      .where('conversation_id', request.conversation_id)
      .where('user_email', userEmail)
      .first();

    if (existingFeedback) {
      // Update existing feedback
      const [updatedFeedback] = await db('response_feedback')
        .where('id', existingFeedback.id)
        .update({
          rating: request.rating,
          correction_text: request.correction_text,
          updated_at: new Date(),
        })
        .returning('*');

      return updatedFeedback;
    } else {
      // Create new feedback
      const [feedback] = await db('response_feedback').insert({
        conversation_id: request.conversation_id,
        user_email: userEmail,
        rating: request.rating,
        correction_text: request.correction_text,
      }).returning('*');

      return feedback;
    }
  }

  async getAppFeedback(userEmail: string): Promise<AppFeedback[]> {
    return db('app_feedback')
      .where('user_email', userEmail)
      .orderBy('created_at', 'desc');
  }

  async getResponseFeedback(userEmail: string): Promise<ResponseFeedback[]> {
    return db('response_feedback')
      .where('user_email', userEmail)
      .orderBy('created_at', 'desc');
  }

  async getResponseFeedbackForConversation(
    conversationId: number,
    userEmail: string
  ): Promise<ResponseFeedback | null> {
    return db('response_feedback')
      .where('conversation_id', conversationId)
      .where('user_email', userEmail)
      .first();
  }

  async getFeedbackStats(): Promise<{
    totalAppFeedback: number;
    totalResponseFeedback: number;
    averageAppRating: number;
    averageResponseRating: number;
    feedbackByType: Array<{ type: string; count: number }>;
  }> {
    const [
      totalAppFeedback,
      totalResponseFeedback,
      averageAppRating,
      averageResponseRating,
      feedbackByType
    ] = await Promise.all([
      db('app_feedback').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      db('response_feedback').count('* as count').first().then(r => parseInt(r?.count as string) || 0),
      db('app_feedback').avg('rating as avg_rating').first().then(r => parseFloat(r?.avg_rating as string) || 0),
      db('response_feedback').avg('rating as avg_rating').first().then(r => parseFloat(r?.avg_rating as string) || 0),
      db('app_feedback')
        .select('feedback_type')
        .count('* as count')
        .groupBy('feedback_type')
    ]);

    return {
      totalAppFeedback,
      totalResponseFeedback,
      averageAppRating: Math.round(averageAppRating * 100) / 100,
      averageResponseRating: Math.round(averageResponseRating * 100) / 100,
      feedbackByType: feedbackByType.map((f: any) => ({
        type: f.feedback_type as string,
        count: parseInt(f.count as string),
      })),
    };
  }
}
