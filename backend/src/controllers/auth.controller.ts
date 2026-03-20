import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { sendSuccess, sendError } from '../utils/response.utils';
import { env } from '../config/env';
import { User } from '../models/user.model';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.register(req.body);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);

    sendSuccess(
      res,
      {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      201,
      'Inscription réussie',
    );
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
    const { accessToken, refreshToken, user } = await authService.login(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);

    sendSuccess(
      res,
      {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      200,
      'Connexion réussie',
    );
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
  res.clearCookie(REFRESH_TOKEN_COOKIE);
  sendSuccess(res, null, 200, 'Déconnexion réussie');
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string;

    if (!refreshToken) {
      sendError(res, 'Refresh token manquant', 401);
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      sendError(res, 'Utilisateur introuvable', 401);
      return;
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);

    res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, cookieOptions);

    sendSuccess(
      res,
      {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      200,
      'Token rafraîchi',
    );
  } catch {
    sendError(res, 'Refresh token invalide ou expiré', 401);
  }
};
