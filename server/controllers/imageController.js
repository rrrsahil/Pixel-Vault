const Image = require("../models/Image");
const crypto = require("crypto");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded or invalid file format.",
      });
    }

    const fileBuffer = req.file.buffer;

    // 1️⃣ Generate hash for duplicate detection
    const hashSum = crypto.createHash("md5");
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest("hex");

    // 2️⃣ Check duplicate image for same user
    const existingImage = await Image.findOne({
      hash: fileHash,
      userId: req.user.id,
    });

    if (existingImage) {
      return res.status(200).json({
        message: "Image identical to previously uploaded image.",
        image: {
          ...existingImage.toObject(),
          url: existingImage.imageUrl,
        },
        isDuplicate: true,
      });
    }

    // 3️⃣ Optimize image using Sharp
    const optimizedBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // 4️⃣ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/webp;base64,${optimizedBuffer.toString("base64")}`,
      {
        folder: "pixelvault",
        resource_type: "image",
        format: "webp",
      },
    );

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    // 5️⃣ Save image metadata to MongoDB
    const newImage = new Image({
      filename: publicId,
      imageUrl: imageUrl,
      size: optimizedBuffer.length,
      hash: fileHash,
      userId: req.user.id,
    });

    await newImage.save();

    // 6️⃣ Send response
    res.status(201).json({
      message: "Image uploaded successfully.",
      image: {
        ...newImage.toObject(),
        url: newImage.imageUrl,
      },
      originalSize: req.file.size,
      optimizedSize: optimizedBuffer.length,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      message: "Server error during upload.",
      error: error.message,
    });
  }
};

exports.getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {
      userId: req.user.id,
    };

    // Search
    if (req.query.search) {
      query.filename = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    // Sorting
    let sortOptions = {};

    const sortBy = req.query.sortBy || "uploadDate";
    const order = req.query.order === "asc" ? 1 : -1;

    sortOptions[sortBy] = order;

    let images = await Image.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments(query);

    images = images.map((img) => {
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
      data: images,
    });
  } catch (error) {
    console.error("Fetch images error:", error);

    res.status(500).json({
      message: "Server error fetching images.",
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found in database.",
      });
    }

    // Security check
    if (image.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this image.",
      });
    }

    const publicId = image.filename;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    // Delete from MongoDB
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete image error:", error);

    res.status(500).json({
      message: "Server error deleting image.",
    });
  }
};
