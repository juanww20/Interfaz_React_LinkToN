import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta absoluta hacia la carpeta de imágenes
const UPLOADS_DIR = path.join(__dirname, '..');

export { UPLOADS_DIR };
