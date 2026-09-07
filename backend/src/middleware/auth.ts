import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/tokenHelper';
import { User, UserRole } from '../models/User';
import { config } from '../config';

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

    // Direct match for super admin token
    if (
      decoded.userId === 'admin-1972' ||
      (decoded.email && decoded.email.toLowerCase() === config.adminDefaultEmail.toLowerCase())
    ) {
      req.user = {
        id: 'admin-1972',
        email: decoded.email || config.adminDefaultEmail,
        role: (decoded.role as UserRole) || 'super_admin',
        name: 'Gharowa Head Admin',
      };
      next();
      return;
    }

    // Database user lookup
    let user: any = null;
    try {
      user = await User.findById(decoded.userId).select('-password');
    } catch {
      // Fallback search by email
      if (decoded.email) {
        user = await User.findOne({ email: decoded.email.toLowerCase() }).select('-password');
      }
    }

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
