import { apiRequest } from '@/helpers/apiRequest';
import z from 'zod';

const chatbotRequestSchema = z.object({
  message: z.string().min(1).max(140),
});

const chatbotResponseSchema = z.object({
  reply: z.string(),
});

export type ChatbotRequest = z.infer<typeof chatbotRequestSchema>;
export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;

export async function postQuestionToChatbot(
  slug: string,
  message: string
): Promise<ChatbotResponse> {
  const body = chatbotRequestSchema.parse({ message });

  const data = await apiRequest<unknown>(`/chatbot/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return chatbotResponseSchema.parse(data);
}
