import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage (diskStorage)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route to handle image upload
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // Clean up temp file
      if (req.file.path) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(500).json({ 
        message: 'Cloudinary configuration (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) is missing in backend .env' 
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'gemstones', // Cloudinary folder name
    });

    // Clean up temporary local file
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.warn('Could not clean up temporary upload file:', err.message);
    }

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    // Clean up temporary local file on failure
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {}
    }
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
