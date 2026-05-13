import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chatbotRequestSchema, ChatbotResponse } from '../schemas/chatbot.schema';
import { loadHotelContext, buildSystemPrompt, generateReply } from '../services/chatbot.service';

const router = Router({ mergeParams: true });

const chatbotLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

router.post('/', chatbotLimiter, async (req, res) => {
  const slug = (req.params as { slug?: string }).slug ?? '';

  const parsed = chatbotRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.flatten() });
  }

  const ctx = await loadHotelContext(slug);
  if (!ctx) return res.status(404).json({ error: 'Hotel not found' });

  try {
    const systemPrompt = buildSystemPrompt(ctx);
    const reply = await generateReply(systemPrompt, parsed.data.messages);
    const body: ChatbotResponse = { reply };
    return res.json(body);
  } catch (err) {
    console.error('chatbot generateReply failed:', err);
    return res.status(503).json({ error: 'Chatbot temporarily unavailable' });
  }
});

export default router;
