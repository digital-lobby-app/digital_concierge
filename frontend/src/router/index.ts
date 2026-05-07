import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useHotelStore } from '@/stores/hotel';
import { adminAuth, refreshSessionAndRetry } from '@/services/auth.service';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
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

    // Admin (protected)
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
          component: () => import('@/views/admin/SettingsView.vue'),
        },
      ],
    },

    // Guest Portal
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
          path: 'guest-dashboard',
          name: 'guest-dashboard',
          component: () => import('@/views/guest/GuestDashboardView.vue'),
        },
        {
          path: 'map',
          name: 'guest-map',
          component: () => import('@/views/guest/MapView.vue'),
          meta: { overlay: true}
        },
        {
          path: 'about',
          name: 'guest-about',
          component: () => import('@/views/guest/AboutView.vue'),
          meta: { overlay: true }
        },
        {
          path: 'requests',
          name: 'guest-requests',
          component: () => import('@/views/guest/GuestBookView.vue'),
          meta: { overlay: true}
        },
        {
          path: 'services',
          name: 'guest-services',
          component: () => import('@/views/guest/ServiceView.vue'),
          meta: { overlay: true}
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const hotel = useHotelStore()

  // On first load — restore tokens from sessionStorage into Pinia
  if (!auth.isAuthenticated) {
    auth.restoreSession()
  }

  if (to.meta.requiresAuth) {
    // Not authenticated at all
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (auth.isExpired) {
      try {
        await refreshSessionAndRetry()
      } catch {
        return { name: 'login' }
      }
    } else {
      try {
        const { user } = await adminAuth()
        auth.setUser(user)
      } catch {
        auth.logout()
        return { name: 'login' }
      }
    }

    if (!hotel.loaded) {
      await hotel.fetchBySession()
    }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
})

export default router;
