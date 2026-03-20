<script setup lang="ts">
import { reactive } from 'vue'
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth.schema'
import { useRegister } from '@/features/auth/composables/useRegister'

const form = reactive<RegisterFormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<Partial<Record<keyof RegisterFormData, string>>>({})
const { isLoading, error, handleRegister } = useRegister()

const onSubmit = async () => {
  Object.keys(errors).forEach((k) => delete errors[k as keyof RegisterFormData])

  const parsed = registerSchema.safeParse(form)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RegisterFormData
      if (key && !errors[key]) errors[key] = issue.message
    }
    return
  }

  const { confirmPassword, ...dto } = parsed.data
  void confirmPassword
  await handleRegister(dto)
}
</script>

<template>
  <form @submit.prevent="onSubmit" noValidate style="display: flex; flex-direction: column; gap: 16px">
    <p v-if="error" role="alert" class="form-error-global">{{ error }}</p>

    <div class="register-field-block">
      <label for="username" class="field-label">Username :</label>
      <div :class="`field-input-row${errors.username ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input id="username" v-model="form.username" type="text" placeholder="Type your username here..." autocomplete="username" />
      </div>
      <p v-if="errors.username" role="alert" class="field-error">{{ errors.username }}</p>
    </div>

    <div class="register-field-block">
      <label for="email" class="field-label">Email :</label>
      <div :class="`field-input-row${errors.email ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input id="email" v-model="form.email" type="email" placeholder="Type your personal email right here..." autocomplete="email" />
      </div>
      <p v-if="errors.email" role="alert" class="field-error">{{ errors.email }}</p>
    </div>

    <div class="register-field-block">
      <label for="password" class="field-label">Enter your password :</label>
      <div :class="`field-input-row${errors.password ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input id="password" v-model="form.password" type="password" placeholder="Type your password here..." autocomplete="new-password" />
      </div>
      <p v-if="errors.password" role="alert" class="field-error">{{ errors.password }}</p>
    </div>

    <div class="register-field-block">
      <label for="confirmPassword" class="field-label">Confirm your password :</label>
      <div :class="`field-input-row${errors.confirmPassword ? ' input-error' : ''}`">
        <div class="field-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>
        <div class="field-separator"></div>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Type your confirm password here..."
          autocomplete="new-password"
        />
      </div>
      <p v-if="errors.confirmPassword" role="alert" class="field-error">{{ errors.confirmPassword }}</p>
    </div>

    <p class="register-footer">
      Already have an account? <RouterLink to="/login">Sign in</RouterLink>
    </p>

    <div class="register-submit-block">
      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Submit' }}
      </button>
    </div>
  </form>
</template>
