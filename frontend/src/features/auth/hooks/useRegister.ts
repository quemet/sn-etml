import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/services/auth.service';
import { RegisterDto } from '../types/auth.types';
import { useAuthStore } from '../../../store/auth.store';
import axios from 'axios';

interface UseRegisterReturn {
  isLoading: boolean;
  error: string | null;
  handleRegister: (dto: RegisterDto) => Promise<void>;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleRegister = async (dto: RegisterDto): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, accessToken } = await register(dto);
      setAuth(user, accessToken); // stocke user + accessToken en mémoire
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Erreur lors de l'inscription");
      } else {
        setError('Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleRegister };
};
