import { routes } from '~shared/config/routes'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: routes.dashboard,
      name: 'dashboard',
      component: () => import('~pages/dashboard/ui/DashboardPage.vue'),
    },
    {
      path: routes.warmUp,
      name: 'warm-up',
      component: () => import('~pages/warm-up/ui/WarmUpPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: routes.dashboard,
    },
  ],
})
