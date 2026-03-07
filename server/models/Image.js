const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number, // Stored in bytes for accuracy
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  hash: {
    type: String,
    sparse: true, // We might have images from before the hashing feature
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Required for multi-user strict galleries
  }
});

module.exports = mongoose.model('Image', imageSchema);
