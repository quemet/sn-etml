<script setup lang="ts">
import { reactive } from 'vue'
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema'
import { useLogin } from '@/features/auth/composables/useLogin'

const form = reactive<LoginFormData>({
  email: '',
  password: '',
})

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({})
const { isLoading, error, handleLogin } = useLogin()

const onSubmit = async () => {
  Object.keys(errors).forEach((k) => delete errors[k as keyof LoginFormData])

  const parsed = loginSchema.safeParse(form)

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LoginFormData
      if (key && !errors[key]) errors[key] = issue.message
    }
    return
  }

  await handleLogin(form)
}

const onSocialLogin = (provider: 'Google' | 'GitHub' | 'Apple' | 'Microsoft') => {
  window.alert(`Connexion ${provider} : implémentation à venir.`)
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    noValidate
    style="display: flex; flex-direction: column; gap: 16px"
  >
    <p v-if="error" role="alert" class="form-error-global">{{ error }}</p>

    <div class="login-field-block">
      <label for="email" class="field-label">Email :</label>
      <div :class="`field-input-row${errors.email ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Type your email here..."
          autocomplete="email"
        />
      </div>
      <p v-if="errors.email" role="alert" class="field-error">{{ errors.email }}</p>
    </div>

    <div class="login-field-block">
      <label for="password" class="field-label">Password :</label>
      <div :class="`field-input-row${errors.password ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Type your password here..."
          autocomplete="current-password"
        />
      </div>
      <p v-if="errors.password" role="alert" class="field-error">{{ errors.password }}</p>
    </div>

    <p class="login-footer">
      Don't have an account? <RouterLink to="/register">Sign up</RouterLink>
    </p>

    <div class="login-submit-block">
      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Sign in' }}
      </button>
    </div>

    <div class="social-auth">
      <div class="social-divider"><span>ou continuer avec</span></div>

      <div class="social-buttons">
        <button type="button" class="social-btn" @click="onSocialLogin('Google')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button type="button" class="social-btn" @click="onSocialLogin('GitHub')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <span>GitHub</span>
        </button>

        <button type="button" class="social-btn" @click="onSocialLogin('Apple')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701z"
            />
          </svg>
          <span>Apple</span>
        </button>

        <button type="button" class="social-btn" @click="onSocialLogin('Microsoft')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#00A4EF" d="M13 1h10v10H13z" />
            <path fill="#7FBA00" d="M1 13h10v10H1z" />
            <path fill="#FFB900" d="M13 13h10v10H13z" />
          </svg>
          <span>Microsoft</span>
        </button>
      </div>
    </div>
  </form>
</template>
