import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthPage = to.path === '/login' || to.path === '/register'

  if (authStore.isAuthenticated && isAuthPage) return '/'
  if (!authStore.isAuthenticated && !isAuthPage) return '/login'

  return true
})

export default router
