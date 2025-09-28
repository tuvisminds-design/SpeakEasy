import OpenAI from 'openai';
import { AISettings } from '../types';
import { MockAIProviderService } from './mockAIProvider';

export interface AIGenerationRequest {
  topic: string;
  speechType: 'impromptu' | 'planned';
  duration: number;
}

export interface AIGenerationResponse {
  speakingPoints: string[];
  provider: string;
}

export class AIProviderService {
  private openai: OpenAI;
  private mockProvider: MockAIProviderService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    });
    this.mockProvider = new MockAIProviderService();
  }

  async generateSpeech(
    request: AIGenerationRequest,
    provider: 'openai' | 'claude' | 'gemini'
  ): Promise<AIGenerationResponse> {
    // For now, only support OpenAI
    if (provider !== 'openai') {
      throw new Error(`AI provider ${provider} is not yet implemented. Please use OpenAI.`);
    }
    
    try {
      return await this.generateWithOpenAI(request);
    } catch (error: any) {
      // If OpenAI fails (e.g., quota exceeded), fall back to mock provider
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        console.log('OpenAI quota exceeded, falling back to mock provider');
        const mockResult = await this.mockProvider.generateSpeech(request, provider);
        return {
          speakingPoints: mockResult.speaking_points,
          provider: 'mock'
        };
      }
      throw error;
    }
  }

  private async generateWithOpenAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const prompt = this.buildPrompt(request);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional public speaking coach. Generate clear, actionable speaking points for the given topic and speech type.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';
    const speakingPoints = this.parseSpeakingPoints(content);

    return {
      speakingPoints,
      provider: 'openai',
    };
  }

  private buildPrompt(request: AIGenerationRequest): string {
    const { topic, speechType, duration } = request;
    
    let framework = '';
    if (speechType === 'impromptu') {
      framework = 'Use the PREP framework (Point, Reason, Example, Point) for each speaking point.';
    } else {
      framework = 'Create a comprehensive outline with introduction, main points, and conclusion.';
    }

    return `Generate speaking points for a ${duration}-minute ${speechType} speech on the topic: "${topic}"

${framework}

Please provide 3-5 clear, actionable speaking points that the speaker can use to structure their presentation. Each point should be concise but informative.

Format your response as a numbered list of speaking points.`;
  }

  private parseSpeakingPoints(content: string): string[] {
    // Extract numbered or bulleted points from the AI response
    const lines = content.split('\n').filter(line => line.trim());
    const points: string[] = [];

    for (const line of lines) {
      // Match numbered lists (1., 2., etc.) or bullet points (-, *, •)
      const match = line.match(/^[\d\-\*\•\.\s]+(.+)$/);
      if (match) {
        points.push(match[1].trim());
      }
    }

    // If no structured points found, split by sentences and take first few
    if (points.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim());
      return sentences.slice(0, 5).map(s => s.trim()).filter(s => s.length > 0);
    }

    return points.slice(0, 5); // Limit to 5 points max
  }
}
