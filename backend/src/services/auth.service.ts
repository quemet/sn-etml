import { User } from '../models/user.model';
import { IUser } from '../types/user.types';
import { hashPassword, comparePassword } from '../utils/hash.utils';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const register = async (dto: RegisterDto): Promise<IUser> => {
  const existingUser = await User.findOne({
    $or: [{ email: dto.email }, { username: dto.username }],
  });

  if (existingUser) {
    if (existingUser.email === dto.email) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }
    throw new Error('USERNAME_ALREADY_EXISTS');
  }

  const hashedPassword = await hashPassword(dto.password);

  const user = await User.create({
    username: dto.username,
    email: dto.email,
    password: hashedPassword,
  });

  return user;
};

export const login = async (dto: LoginDto): Promise<AuthTokens> => {
  const user = await User.findOne({ email: dto.email });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new Error('ACCOUNT_DISABLED');
  }

  const isPasswordValid = await comparePassword(dto.password, user.password);

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  return { accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
  const { verifyRefreshToken } = await import('../utils/jwt.utils');

  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.userId);

  if (!user || !user.isActive) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id, user.role);

  return { accessToken, refreshToken: newRefreshToken };
};
