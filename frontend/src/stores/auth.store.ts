import { defineStore } from 'pinia'
import { register } from '@/services/auth.service'
import type { AuthUser, RegisterDto } from '@/features/auth/types/auth.type'

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.token),
    },

    actions: {
        setAuth(user: AuthUser, accessToken: string) {
            this.user = user;
            this.token = accessToken;
            localStorage.setItem('token', accessToken);
        },
        clearAuth() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
        async handleRegister(dto: RegisterDto) {
            if (this.loading) return;
            this.loading = true;
            this.error = null;

            try {
                const res = await register(dto);
                this.setAuth(res.user, res.accessToken);
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
