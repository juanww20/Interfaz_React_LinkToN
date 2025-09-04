import multer from "multer";
import { get_upload_path } from "../../utils/uploads_files.js";

export const uploadAudio = multer({
  storage: get_upload_path("uploads", "audios"),
  limits: { fileSize: 1024 * 1024 * 100 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file));
  }
});