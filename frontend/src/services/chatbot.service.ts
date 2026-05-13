import { apiRequest } from '@/helpers/apiRequest';
import z from 'zod';

const MAX_HISTORY_MESSAGES = 20;
const MAX_USER_MESSAGE_CHARS = 140;

const apiMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});
export type ApiMessage = z.infer<typeof apiMessageSchema>;

const chatbotRequestSchema = z.object({
  messages: z.array(apiMessageSchema).min(1).max(MAX_HISTORY_MESSAGES),
});

const chatbotResponseSchema = z.object({
  reply: z.string(),
});

export type ChatbotRequest = z.infer<typeof chatbotRequestSchema>;
export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;

export { MAX_USER_MESSAGE_CHARS, MAX_HISTORY_MESSAGES };

export async function postChatbotMessages(
  slug: string,
  messages: ApiMessage[]
): Promise<ChatbotResponse> {
  const body = chatbotRequestSchema.parse({ messages });

  const data = await apiRequest<unknown>(`/hotels/${slug}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return chatbotResponseSchema.parse(data);
}
