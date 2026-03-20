import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { login } from '@/services/auth.service'
import type { LoginDto } from '@/features/auth/types/auth.type'
import { useAuthStore } from '@/stores/auth.store'

export const useLogin = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()
  const authStore = useAuthStore()

  const handleLogin = async (dto: LoginDto): Promise<void> => {
    if (isLoading.value) return
    isLoading.value = true
    error.value = null

    try {
      const { user, accessToken } = await login(dto)
      authStore.setAuth(user, accessToken)
      await router.push('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Erreur lors de la connexion'
      } else {
        error.value = 'Une erreur inattendue est survenue'
      }
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, handleLogin }
}
