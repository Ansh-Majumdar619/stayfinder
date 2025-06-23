import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname workaround (ES module compatibility)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (optional)
});

export default upload;
