const multer = require('multer');
const path = require('path');
const ErrorResponse = require('./ErrorResponse');

// Define storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be saved in the 'uploads' folder we created in Step 1
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: fieldname-timestamp.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type to ensure only images are uploaded
const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Images Only (jpeg, jpg, png, webp)!', 400));
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;