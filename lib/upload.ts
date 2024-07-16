import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

// Crear la carpeta `uploads` si no existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento para multer
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving to:', uploadDir); // Log directory where files are saved
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('File name:', filename); // Log the generated file name
    cb(null, filename);
  }
});

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB límite de tamaño de archivo
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|pdf/; // Added 'pdf' to the allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Error: Tipo de archivo no soportado'));
    }
  }
});

export default upload;
