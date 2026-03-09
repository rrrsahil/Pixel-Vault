import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import API from "../utils/api";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import "../styles/Upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    // Check if multiple files dropped
    if (acceptedFiles.length > 1) {
      toast.error("Please upload only one image at a time.");
      return;
    }

    const selectedFile = acceptedFiles[0];

    // File validation is handled by react-dropzone accept properties,
    // but adding manual check as fallback
    if (!selectedFile.type.match("image/(jpeg|png|webp)")) {
      toast.error("Invalid file type. Only JPEG, PNG, and WEBP allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setUploadedUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxSize: 5242880, // 5MB
      multiple: false,
    });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // 1. Client-side Compression
      const options = {
        maxSizeMB: 1, // Compress down to max 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // 2. Upload via API
      const formData = new FormData();
      formData.append("image", compressedFile, compressedFile.name);

      const response = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadedUrl(response.data.image.url);

      if (response.data.isDuplicate) {
        toast.info(
          "Exact duplicate image detected; providing the pre-existing URL to save space.",
        );
      } else {
        toast.success("Image compressed and uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error uploading image. Please check limits.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
  };

  const copyToClipboard = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      toast.info("URL copied to clipboard!");
    }
  };

  return (
    <div className="container page-container">
      <div className="upload-header">
        <h2>Upload Image</h2>
        <p>Supports JPEG, PNG, and WEBP. Maximum file size is 5MB.</p>
      </div>

      <div className="upload-content">
        {!preview && !uploadedUrl ? (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "drag-active" : ""} ${isDragReject ? "drag-reject" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
              <h3>Choose a file or drag & drop it here</h3>
              <p>JPEG, PNG, WEBP, up to 5MB</p>
              <button className="btn btn-secondary mt-1">Browse File</button>
            </div>
          </div>
        ) : (
          <div className="preview-container">
            <div className="preview-card">
              <div className="preview-image-wrapper">
                <img
                  src={preview || uploadedUrl}
                  alt="Preview"
                  className="preview-image"
                />
                {uploading && (
                  <div className="uploading-overlay">
                    <div className="spinner-large"></div>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              <div className="preview-actions">
                {!uploadedUrl ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={handleReset}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <span className="spinner"></span> Uploading
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-upload"></i> Upload Image
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="success-actions">
                    <div className="url-box">
                      <input type="text" value={uploadedUrl} readOnly />
                      <button
                        className="btn btn-primary"
                        onClick={copyToClipboard}
                      >
                        <i className="fa-regular fa-copy"></i>
                      </button>
                    </div>
                    <button
                      className="btn btn-secondary mt-1"
                      onClick={handleReset}
                    >
                      Upload Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
