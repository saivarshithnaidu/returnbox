import OpenAI from 'openai';

export const openrouter = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'https://returnbox.growxlabs.tech',
    'X-Title': 'Return Box by Sana',
  },
});

export const AI_MODELS = {
  chat: 'anthropic/claude-3-haiku',         // Gift Genius, general chat
  vision: 'anthropic/claude-3-haiku',        // Image analysis
  copywriting: 'anthropic/claude-3-5-sonnet', // Product descriptions
  forecasting: 'openai/gpt-4o-mini',         // Inventory forecasting
} as const;

export function isAIAvailable(): boolean {
  return !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== '');
}
