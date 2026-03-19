import { Request } from 'express';
import { JwtPayload } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
