import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();

export function useOverlayBack() {
  const router = useRouter();
  const route = useRoute();

  function back() {
    if (auth.isAuthenticated && window.history.length > 1) {
      router.push({ name: 'admin-dashboard' });
      window.history.back()
    } else {
      router.push({
        name: 'guest-dashboard',
        params: { slug: route.params.slug },
      });
    }
  }

  return { back };
}
