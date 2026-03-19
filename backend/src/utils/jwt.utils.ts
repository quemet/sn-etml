import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

export interface JwtPayload {
  userId: Types.ObjectId;
  role: 'user' | 'admin';
}

export const generateAccessToken = (userId: Types.ObjectId, role: 'user' | 'admin'): string => {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign({ userId: userId.toString(), role }, env.jwt.secret, options);
};

export const generateRefreshToken = (userId: Types.ObjectId, role: 'user' | 'admin'): string => {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign({ userId: userId.toString(), role }, env.jwt.refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
};
