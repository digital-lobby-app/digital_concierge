// helpers/apiRequest.ts
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  })

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error || errorData?.message || 'Request failed')
  }

  return res.json()
}