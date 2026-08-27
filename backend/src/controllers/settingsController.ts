import { Request, Response, NextFunction } from 'express';
import { RestaurantSettings } from '../models';
import { AuthenticatedRequest } from '../middleware/auth';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.status(200).json({
      success: true,
      message: 'রেস্তোরাঁর সেটিংস আপডেট হয়েছে / Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
