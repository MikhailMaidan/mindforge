import { routes } from '~shared/config/routes'
import { createRouter, createWebHistory } from 'vue-router'

const plugPage = () => import('~pages/plug/ui/PlugPage.vue')

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
      path: routes.plug,
      name: 'plug',
      component: plugPage,
    },
    {
      path: routes.statistics,
      name: 'statistics',
      component: plugPage,
    },
    {
      path: routes.customize,
      name: 'customize',
      component: plugPage,
    },
    {
      path: routes.leaderboard,
      name: 'leaderboard',
      component: plugPage,
    },
    {
      path: routes.tricks,
      name: 'tricks',
      component: plugPage,
    },
    {
      path: routes.blog,
      name: 'blog',
      component: plugPage,
    },
    {
      path: routes.settings,
      name: 'settings',
      component: plugPage,
    },
    {
      path: routes.info,
      name: 'info',
      component: plugPage,
    },
    {
      path: routes.profile,
      name: 'profile',
      component: plugPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: routes.plug,
    },
  ],
})
