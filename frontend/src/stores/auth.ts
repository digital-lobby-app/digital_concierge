import type { AuthUser, SessionData } from '@/types/Auth';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const expiresAt = ref<number | null>(null);

  const isExpired = computed(() => {
    if (!expiresAt.value) return true;
    return Date.now() >= expiresAt.value * 1000;
  });
  const isAuthenticated = computed(() => !!accessToken.value && !isExpired.value);

  function setSession(data: SessionData) {
    user.value = data.user;
    accessToken.value = data.access_token;
    refreshToken.value = data.refresh_token;
    expiresAt.value = data.expires_at;

    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('refresh_token', data.refresh_token);
    sessionStorage.setItem('expires_at', String(data.expires_at));
  }

  function clearSession() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    expiresAt.value = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires_at');
  }

  function restoreSession() {
    const token = sessionStorage.getItem('access_token');
    const refresh = sessionStorage.getItem('refresh_token');
    const exp = sessionStorage.getItem('expires_at');

    if (!token || !refresh || !exp) {
      clearSession();
      return;
    }

    accessToken.value = token;
    refreshToken.value = refresh;
    expiresAt.value = Number(exp);
  }

  function setUser(u: AuthUser) {
    user.value = u;
  }

  function logout() {
    clearSession();
  }

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt,
    isAuthenticated,
    isExpired,
    setSession,
    clearSession,
    restoreSession,
    setUser,
    logout,
  };
});
