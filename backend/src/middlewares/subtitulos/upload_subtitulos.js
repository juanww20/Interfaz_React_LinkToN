import multer from 'multer';
import { get_upload_path } from "../../utils/uploads_files.js"

export const uploadSubtitulos = multer({
    storage: get_upload_path("uploads", "subtitulos"),
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = ["text/vtt", "application/x-subrip", "text/plain"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file));
    }   
})
