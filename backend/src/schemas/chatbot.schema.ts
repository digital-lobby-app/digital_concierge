import { z } from 'zod';

export const MAX_HISTORY_MESSAGES = 20;
export const MAX_USER_MESSAGE_CHARS = 140;
export const MAX_ASSISTANT_MESSAGE_CHARS = 8000;

const apiMessageSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('user'),
    content: z
      .string()
      .transform((s) => s.normalize('NFC').trim())
      .pipe(z.string().min(1).max(MAX_USER_MESSAGE_CHARS)),
  }),
  z.object({
    role: z.literal('assistant'),
    content: z
      .string()
      .transform((s) => s.normalize('NFC').trim())
      .pipe(z.string().min(1).max(MAX_ASSISTANT_MESSAGE_CHARS)),
  }),
]);
export type ApiMessage = z.infer<typeof apiMessageSchema>;

export const chatbotRequestSchema = z.object({
  messages: z
    .array(apiMessageSchema)
    .min(1)
    .max(MAX_HISTORY_MESSAGES)
    .refine((msgs) => msgs[msgs.length - 1].role === 'user', {
      message: 'Last message must be from user',
    })
    .refine(
      (msgs) => msgs.every((m, i) => m.role === (i % 2 === 0 ? 'user' : 'assistant')),
      { message: 'Roles must alternate starting with user' }
    ),
});
export type ChatbotRequest = z.infer<typeof chatbotRequestSchema>;

export const chatbotResponseSchema = z.object({
  reply: z.string(),
});
export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;
