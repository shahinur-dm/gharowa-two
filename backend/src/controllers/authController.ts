import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { signToken } from '../utils/tokenHelper';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'ইমেইল বা পাসওয়ার্ড সঠিক নয় / Invalid credentials',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে / Account is deactivated',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'ইমেইল বা পাসওয়ার্ড সঠিক নয় / Invalid credentials',
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('gharowa_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'লগইন সফল হয়েছে / Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('gharowa_token');
  res.status(200).json({
    success: true,
    message: 'লগআউট সফল হয়েছে / Logged out successfully',
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffList = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staff = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে / Email already exists' });
      return;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'cashier',
    });

    res.status(201).json({
      success: true,
      message: 'স্টাফ অ্যাকাউন্ট তৈরি হয়েছে / Staff account created',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
