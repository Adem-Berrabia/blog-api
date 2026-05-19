const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads si inexistant
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + extension originale
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Filtre : uniquement les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValidMime = allowedTypes.test(file.mimetype);
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase().slice(1)
  );

  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    cb(
      new Error('Format de fichier non autorisé. Utilisez JPEG, PNG, GIF ou WebP.'),
      false
    );
  }
};

// Instance multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
