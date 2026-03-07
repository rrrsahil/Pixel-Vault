const Image = require('../models/Image');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const extractUrlPath = (fullPath) => {
    const uploadsIndex = fullPath.indexOf('uploads');
    if (uploadsIndex !== -1) {
        const relativePath = fullPath.substring(uploadsIndex + 8);
        return `/images/${relativePath.replace(/\\/g, '/')}`; 
    }
    return null;
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file format.' });
    }

    const fileBuffer = req.file.buffer;
    
    // 1. DUPLICATE PREVENTION: Generate Hash of file
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest('hex');

    // Check if this exact image exists in the DB FOR THIS USER
    const existingImage = await Image.findOne({ hash: fileHash, userId: req.user.id });
    if (existingImage) {
        return res.status(200).json({
            message: 'Image identical to previously uploaded image. Returning existing URL.',
            image: { ...existingImage.toObject(), url: existingImage.imageUrl }, // Backwards compat in response for frontend for a moment
            isDuplicate: true
        });
    }

    // 2. FORMAT OPTIMIZATION: Convert to WEBP using sharp
    // Calculate folder structure `/uploads/YYYY/MM`
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    const dir = path.join(__dirname, '..', 'uploads', year, month);
    fs.mkdirSync(dir, { recursive: true });

    const uuid = uuidv4();
    const filename = `${uuid}.webp`; // Every file becomes WEBP
    const filepath = path.join(dir, filename);

    // Compress & Save with Sharp
    const optimizedBuffer = await sharp(fileBuffer)
        .webp({ quality: 80 }) // 80% quality compression WebP
        .toBuffer();
    
    fs.writeFileSync(filepath, optimizedBuffer);

    // 3. GENERATE URL AND SAVE TO DB
    const urlPath = extractUrlPath(filepath);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}${urlPath}`;
    
    const newImage = new Image({
      filename: filename,
      imageUrl: fullUrl,
      size: optimizedBuffer.length,
      hash: fileHash,
      userId: req.user.id // Bound natively because of Protected route
    });

    await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully.',
      image: { ...newImage.toObject(), url: newImage.imageUrl }, // Standardizing back to frontend's expectation if they use .url
      originalSize: req.file.size,
      optimizedSize: optimizedBuffer.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload.', error: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    // 4. PAGINATION: Implement limit and skip
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default load 20
    const skip = (page - 1) * limit;

    // Build query - Only fetch current user's images
    const query = { userId: req.user.id };

    // Search query parameter
    if (req.query.search) {
      query.filename = { $regex: req.query.search, $options: 'i' }; // Case-insensitive regex
    }

    // Sort processing
    let sortOptions = {};
    const sortBy = req.query.sortBy || 'uploadDate';
    const order = req.query.order === 'asc' ? 1 : -1;
    sortOptions[sortBy] = order;

    let images = await Image.find(query).sort(sortOptions).skip(skip).limit(limit);
    const total = await Image.countDocuments(query);
    
    // Convert imageUrl -> url for frontend backward compatibility during standard mapping
    images = images.map(img => {
      const imgObj = img.toObject();
      imgObj.url = imgObj.imageUrl;
      return imgObj;
    });

    res.status(200).json({
      success: true,
      count: images.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: images
    });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ message: 'Server error fetching images.' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found in database.' });
    }

    // Security check: Match requesting user against the image owner
    if (image.userId.toString() !== req.user.id.toString()) {
       return res.status(403).json({ message: 'Not authorized to delete this image.' });
    }

    const urlPattern = /images\/(.*)/;
    const match = image.imageUrl.match(urlPattern);
    
    if (match && match[1]) {
       const relativePath = match[1];
       const fullFilePath = path.join(__dirname, '..', 'uploads', ...relativePath.split('/'));
       
       if (fs.existsSync(fullFilePath)) {
         fs.unlinkSync(fullFilePath);
       }
    }

    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error deleting image.' });
  }
};
