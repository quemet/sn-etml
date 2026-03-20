import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: App },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: RegisterPage },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isAuthPage = to.path === '/login' || to.path === '/register';

  if(authStore.isAuthenticated && isAuthPage) return '/';
  if (!authStore.isAuthenticated && !isAuthPage) return '/register';

  return true;
});

export default router
