import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";
import type { AuthUser, LoginDto, RegisterDto } from "@/features/auth/types/auth.type";

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', dto)
    return response.data.data
};

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', dto)
    return response.data.data
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const refreshTokens = async (): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data.data;
};
