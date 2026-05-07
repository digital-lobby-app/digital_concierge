import { z } from 'zod';
import { apiRequest } from '@/helpers/apiRequest';
import type { Auth, AuthResponse } from '@/types/Auth';

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

export async function adminLogin(data: Auth) {
  const parsed = authSchema.parse(data);

  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  });
}
