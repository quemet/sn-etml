import { User } from '../models/user.model';
import { IUser } from '../types/user.types';
import { hashPassword, comparePassword } from '../utils/hash.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';

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
  user: IUser;
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

export const register = async (dto: RegisterDto): Promise<IUser> => {
  const existingUser = await User.findOne({
    $or: [{ email: dto.email }, { username: dto.username }],
  });

  if (existingUser) {
    if (existingUser.email === dto.email) throw new Error('EMAIL_ALREADY_EXISTS');
    throw new Error('USERNAME_ALREADY_EXISTS');
  }

  const hashedPassword = await hashPassword(dto.password);

  try {
    return await User.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });
  } catch (error) {
    const mongoError = error as MongoError;
    if (mongoError.code === 11000) {
      if (mongoError.keyPattern?.email || mongoError.keyValue?.email)
        throw new Error('EMAIL_ALREADY_EXISTS');
      if (mongoError.keyPattern?.username || mongoError.keyValue?.username)
        throw new Error('USERNAME_ALREADY_EXISTS');
    }
    throw error;
  }
};

export const login = async (dto: LoginDto): Promise<AuthTokens> => {
  const user = await User.findOne({ email: dto.email });

  if (!user) throw new Error('INVALID_CREDENTIALS');
  if (!user.isActive) throw new Error('ACCOUNT_DISABLED');

  const isPasswordValid = await comparePassword(dto.password, user.password);
  if (!isPasswordValid) throw new Error('INVALID_CREDENTIALS');

  return {
    accessToken: generateAccessToken(user._id, user.role),
    refreshToken: generateRefreshToken(user._id, user.role),
    user,
  };
};
