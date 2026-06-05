import { Router } from 'express';
import { getProfile, updateProfile } from './profile.controller';
import { upload } from '../../config/cloudinary';

const router = Router();

router.get('/', getProfile);
// Multer middleware 'upload.single("logo")' handles the file upload to Cloudinary
router.put('/', upload.single('logo'), updateProfile);

export default router;
