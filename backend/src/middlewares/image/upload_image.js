import multer from 'multer';
import { get_upload_path } from "../../utils/uploads_files.js";

// Validaciones: tipo y tamaño
export const uploadImage = multer({
  storage: get_upload_path('uploads', 'images'),
  limits: { fileSize: 1024 * 1024 * 150 }, // 150MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file));
  }
});