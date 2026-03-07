const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/upload');
const imageController = require('../controllers/imageController');
const { protect, requireAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 requests per `window` (here, per hour)
  message: { message: 'Upload limit exceeded. Please try again after an hour.' }
});

// Upload Image
// POST /api/upload
router.post('/upload', protect, requireAuth, uploadLimiter, uploadMiddleware.single('image'), imageController.uploadImage);

// Get All Images (For context user)
// GET /api/images
router.get('/images', protect, requireAuth, imageController.getImages);

// Delete Image
// DELETE /api/images/:id
router.delete('/images/:id', protect, requireAuth, imageController.deleteImage);

module.exports = router;
