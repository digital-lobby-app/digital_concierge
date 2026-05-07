// services/auth.service.ts
import { z } from 'zod'
import { apiRequest } from '@/helpers/apiRequest'
import type { Auth, SessionData, AuthUser } from '@/types/Auth'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authSchema = z.object({
  email: z.string().email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(6).max(20).regex(/^(?=.*[A-Z])(?=.*\d).+$/),
})

//login
export async function adminLogin(data: Auth): Promise<SessionData> {
  const parsed = authSchema.parse(data)
  return apiRequest<SessionData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(parsed),
  })
}

//logout
export async function adminLogout(): Promise<void> {
  const auth = useAuthStore()

  if (auth.accessToken && auth.refreshToken) {
    await apiRequest<void>('/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${auth.accessToken}` },
      body: JSON.stringify({
        access_token: auth.accessToken,
        refresh_token: auth.refreshToken,
      }),
    })
  }

  auth.logout()
  router.push({ name: 'login' })
}

// auth
export async function adminAuth(): Promise<{ user: AuthUser }> {
  const auth = useAuthStore()
  return apiRequest<{ user: AuthUser }>('/auth/me', {
    headers: { 'Authorization': `Bearer ${auth.accessToken}` },
  })
}

// refresh and retry
export async function refreshSessionAndRetry(): Promise<void> {
  const auth = useAuthStore()

  try {
    const res = await apiRequest<SessionData>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: auth.refreshToken }),
    })

    auth.setSession(res)

    // Verify the new token works + hydrate user
    const { user } = await adminAuth()
    auth.setUser(user)

  } catch {
    auth.logout()
    router.push({ name: 'login' })
    throw new Error('Session expired — please log in again')
  }
}