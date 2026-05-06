import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useHotelStore } from '@/stores/hotel';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Public ──────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },

    // ── Admin (protected) ────────────────────────────────────
    {
      path: '/admin',
      component: () => import('@/layouts/AdminShell.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
      ],
    },

    // ── Guest portal (public) ────────────────────────────────
    {
      path: '/:slug',
      component: () => import('@/layouts/GuestShell.vue'),
      beforeEnter: async (to) => {
        const hotel = useHotelStore();
        const ok = await hotel.fetchBySlug(to.params.slug as string);
        if (!ok) return { name: 'not-found' };
      },
      children: [
        {
          path: '',
          redirect: (to) => `/${to.params.slug}/guest-dashboard`,
        },
        {
          path: 'map',
          name: 'guest-map',
          component: () => import('@/views/guest/MapView.vue'),
        },
        {
          path: 'about',
          name: 'guest-about',
          component: () => import('@/views/guest/AboutView.vue'),
        },
        {
          path: 'requests',
          name: 'guest-requests',
          component: () => import('@/views/guest/GuestBookView.vue'),
        },
      ],
    },

    // ── Fallback ─────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' },
    },
  ],
});

// ── Global navigation guard ──────────────────────────────────
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  const hotel = useHotelStore();

  // Redirect to login if route requires auth and no token
  if (to.meta.requiresAuth && !auth.token) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  // Redirect away from login if already authenticated
  if (to.name === 'login' && auth.token) {
    return { name: 'admin-dashboard' };
  }

  // Load hotel config for admin routes if not yet loaded
  if (to.meta.requiresAuth && auth.token && !hotel.loaded) {
    await hotel.fetchBySession();
  }
});

export default router;
