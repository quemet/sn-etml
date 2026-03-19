import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('❌ Erreur non gérée :', err.message);

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
  });
};
