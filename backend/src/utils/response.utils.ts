import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number,
  message?: string,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode: number = 500): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
