import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      res.status(400).json({ success: false, message: 'No image data provided' });
      return;
    }

    // If it's already an external URL (http:// or https://), return it directly
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      res.status(200).json({
        success: true,
        message: 'Image URL verified',
        url: image,
      });
      return;
    }

    // Parse Base64 image
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ success: false, message: 'Invalid base64 image string' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine extension
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('gif')) ext = 'gif';

    const safeName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'img';
    const uniqueFileName = `${safeName}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    res.status(201).json({
      success: true,
      message: 'ছবি সফলভাবে আপলোড হয়েছে / Image uploaded successfully',
      url: fileUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    next(error);
  }
};
