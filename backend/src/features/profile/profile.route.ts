import { Router } from 'express';
import { getProfile, updateProfile } from './profile.controller';
import { upload } from '../../config/cloudinary';

const router = Router();

router.get('/', getProfile);
router.put('/', (req, res, next) => {
  upload.single('logo')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(500).json({ error: 'Upload failed', details: err.message || err });
    }
    next();
  });
}, updateProfile);

export default router;
