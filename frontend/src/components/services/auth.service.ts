import { z } from 'zod';
import { apiRequest } from '../helpers/apiRequest';
import type { Auth } from '../types/Auth';

const authSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(6)
    .max(20)
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/),
});

export async function auth(data: Auth) {
  const parsed = authSchema.parse(data);

  return apiRequest<Auth>('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  });
}
