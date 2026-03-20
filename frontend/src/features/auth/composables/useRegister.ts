import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { register } from "@/services/auth.service";
import type { RegisterDto } from "@/features/auth/types/auth.type";
import { useAuthStore } from "@/stores/auth.store";

export const useRegister = () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const router = useRouter();
    const authStore = useAuthStore();

    const handleRegister = async (dto: RegisterDto): Promise<void> => {
        if (isLoading.value) return;
        isLoading.value = true;
        error.value = null;

        try {
            const { user, accessToken } = await register(dto);
            authStore.setAuth(user, accessToken);
            await router.push('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                error.value = err.response?.data?.message || "Erreur lors de l'inscription";
            } else {
                error.value = 'Une erreur inattendue est survenue';
            }
        } finally {
            isLoading.value = false;
        }
    };

    return { isLoading, error, handleRegister };
};
