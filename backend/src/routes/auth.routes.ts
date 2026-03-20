import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères")
    .trim(),
  email: z.string().email('Email invalide').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase().trim(),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// POST /auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/logout
router.post('/logout', authMiddleware, authController.logout);

// POST /auth/refresh
router.post('/refresh', authController.refresh);

export default router;
