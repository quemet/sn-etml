import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.register(req.body);

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    sendSuccess(res, userResponse, 201, 'Inscription réussie');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        sendError(res, 'Cet email est déjà utilisé', 409);
        return;
      }
      if (error.message === 'USERNAME_ALREADY_EXISTS') {
        sendError(res, "Ce nom d'utilisateur est déjà utilisé", 409);
        return;
      }
    }
    sendError(res, "Erreur lors de l'inscription", 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokens = await authService.login(req.body);
    sendSuccess(res, tokens, 200, 'Connexion réussie');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        sendError(res, 'Email ou mot de passe incorrect', 401);
        return;
      }
      if (error.message === 'ACCOUNT_DISABLED') {
        sendError(res, 'Ce compte est désactivé', 403);
        return;
      }
    }
    sendError(res, 'Erreur lors de la connexion', 500);
  }
};

export const logout = (_req: Request, res: Response): void => {
  sendSuccess(res, null, 200, 'Déconnexion réussie');
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(refreshToken);
    sendSuccess(res, tokens, 200, 'Token rafraîchi');
  } catch (error) {
    sendError(res, 'Refresh token invalide ou expiré', 401);
  }
};
