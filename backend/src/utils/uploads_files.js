import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { UPLOADS_DIR } from './global-path.js';

const __dirname = UPLOADS_DIR;

function createUploadPath(folder1, folder2) {
  const uploadPath = path.join(__dirname, folder1, folder2);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
}

export function get_upload_path(folder1, folder2) {
  const finalPath = createUploadPath(folder1, folder2);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, finalPath); // ahora sí se pasa un path válido
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();

      const originalName = path.parse(file.originalname).name;
      const sanitizedName = originalName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

      const extension = path.extname(file.originalname).toLowerCase();

      const uniqueName = `${timestamp}-${sanitizedName}${extension}`;
      cb(null, uniqueName);
    }
  });

  return storage; // importante retornar el objeto storage
}
