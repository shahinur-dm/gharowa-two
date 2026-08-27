import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/tokenHelper';
import { User, UserRole } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.gharowa_token) {
      token = req.cookies.gharowa_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'অনুমোদন প্রয়োজন / Authentication required',
      });
      return;
    }

    const decoded: TokenPayload = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'ব্যবহারকারী অ্যাকাউন্ট সক্রিয় নয় / User account is not active',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন / Invalid or expired session',
    });
  }
};
