import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/pages/Welcome.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/Register.vue'),
    },
  ],
})

export default router
