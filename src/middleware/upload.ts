import multer from 'multer';
import { mkdirSync } from 'node:fs';
import path from 'path';

mkdirSync(path.resolve('uploads'), { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan folder 'uploads/' sudah dibuat di direktori root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  }
});