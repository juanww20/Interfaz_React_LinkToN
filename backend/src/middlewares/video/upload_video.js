import multer from 'multer';
import { get_upload_path } from "../../utils/uploads_files.js";

export const uploadVideo = multer({
  storage: get_upload_path('uploads', 'videos'),
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/mkv', 'video/webm'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type, only MP4, MKV, and WEBM are allowed'));
  }
});
