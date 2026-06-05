import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Konfigurasi Cloudinary dari Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'transparas_profiles',
      format: 'png', // Support multiple tapi kita standardisasi ke png/jpeg di cloudinary
      public_id: `banjar_logo_${Date.now()}`,
    };
  },
});

export const upload = multer({ storage: storage });
export { cloudinary };
