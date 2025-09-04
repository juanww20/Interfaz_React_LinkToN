import multer from "multer";

export function handleMulterErrors(middleware) {
  return function (req, res, next) {
    middleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "El archivo excede el tamaño máximo permitido (video 500MB y imagen 150MB)." });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ message: "Formato de video o imagen no es permitido." });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Error al subir el archivo." });
      }
      next();
    });
  };
}
