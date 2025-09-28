import { AIGenerationRequest } from '../types';

export class MockAIProviderService {
  async generateSpeech(
    request: AIGenerationRequest,
    provider: 'openai' | 'claude' | 'gemini' = 'openai'
  ): Promise<{ speaking_points: string[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { topic, speech_type, duration } = request;
    
    // Generate mock speaking points based on the topic and type
    const mockPoints = this.generateMockPoints(topic, speech_type, duration);
    
    return {
      speaking_points: mockPoints
    };
  }

  private generateMockPoints(topic: string, speechType: string, duration: number): string[] {
    const basePoints = [
      `Introduction: ${topic} is a crucial topic that affects many aspects of our daily lives`,
      `Main Point 1: Understanding the fundamentals of ${topic.toLowerCase()} helps us make better decisions`,
      `Main Point 2: Real-world examples show how ${topic.toLowerCase()} impacts our communities`,
      `Main Point 3: The future implications of ${topic.toLowerCase()} require our attention and action`
    ];

    if (speechType === 'impromptu') {
      return [
        `Point: ${topic} is an important issue that deserves our attention`,
        `Reason: This topic affects many people and has significant implications`,
        `Example: Consider how ${topic.toLowerCase()} impacts our daily lives`,
        `Point: We should take action to address the challenges related to ${topic.toLowerCase()}`
      ];
    } else {
      // Planned presentation - more structured
      const points = [
        `Introduction: Welcome everyone. Today we'll explore ${topic}`,
        `Overview: We'll cover three main areas: understanding, impact, and future implications`,
        `Section 1: Understanding ${topic.toLowerCase()} - the key concepts and principles`,
        `Section 2: Real-world impact - how ${topic.toLowerCase()} affects our communities`,
        `Section 3: Future outlook - what we can expect and how to prepare`,
        `Conclusion: ${topic} is a topic that requires our continued attention and action`
      ];

      // Adjust length based on duration
      if (duration <= 5) {
        return points.slice(0, 4);
      } else if (duration <= 10) {
        return points;
      } else {
        return [
          ...points,
          `Additional Point: The economic implications of ${topic.toLowerCase()}`,
          `Additional Point: Social and cultural considerations around ${topic.toLowerCase()}`,
          `Call to Action: What steps can we take to address ${topic.toLowerCase()}?`
        ];
      }
    }
  }
}
