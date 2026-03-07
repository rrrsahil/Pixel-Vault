import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import '../styles/Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [order, setOrder] = useState('desc');

  // Loading UX Tracking mapped strictly to DOM nodes
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    // When filters change, strictly reset state back to page 1 natively
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1, searchTerm, sortBy, order);
    // eslint-disable-next-line
  }, [searchTerm, sortBy, order]);

  // Infinite Scroll Trigger via Ref
  const lastImageElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
           const nextPage = prevPage + 1;
           fetchImages(nextPage, searchTerm, sortBy, order);
           return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, searchTerm, sortBy, order]);

  const fetchImages = async (pageNumber, search, sortby, orderdir) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const endpoint = `http://localhost:5000/api/images?page=${pageNumber}&limit=15&search=${search}&sortBy=${sortby}&order=${orderdir}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (pageNumber === 1) {
        setImages(response.data.data);
      } else {
        setImages(prev => {
             // De-duplicate in case of strict timing intersections grabbing identical nodes natively
             const existingIds = new Set(prev.map(img => img._id));
             const newImages = response.data.data.filter(img => !existingIds.has(img._id));
             return [...prev, ...newImages];
        });
      }

      setHasMore(pageNumber < response.data.pages);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images from server.');
    } finally {
      if (pageNumber === 1) setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleImageLoad = (id) => {
      setLoadedImages(prev => new Set(prev).add(id));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.info('URL copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this image?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/images/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      setImages(images.filter((img) => img._id !== id));
      toast.success('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image. You might not have permission.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container page-container">
      <div className="gallery-header">
        <h2>Your Gallery</h2>
        <p>Manage all your uploaded images.</p>
        
        {/* Search & Filters Banner */}
        <div className="gallery-controls">
          <div className="search-box">
             <i className="fa-solid fa-magnifying-glass"></i>
             <input 
                type="text" 
                placeholder="Search images by filename..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="filter-group">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="uploadDate">Sort by Date</option>
              <option value="size">Sort by Size</option>
              <option value="filename">Sort by Name</option>
            </select>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="filter-select">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="image-grid">
           {/* Skeleton Loaders matching 15 limit explicitly */}
           {Array.from({ length: 15 }).map((_, i) => (
             <div className="image-card skeleton-card" key={`skel-${i}`}>
                 <div className="image-wrapper skeleton"></div>
                 <div className="image-details">
                    <div className="detail-row skeleton skeleton-text"></div>
                    <div className="detail-row subtext skeleton skeleton-text-short"></div>
                 </div>
             </div>
           ))}
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
           <div className="empty-icon">
             <i className="fa-regular fa-image"></i>
           </div>
           <h3>No images found</h3>
           <p>{searchTerm ? 'Try adjusting your search criteria.' : 'Upload your first image to see it here.'}</p>
        </div>
      ) : (
        <>
          <div className="image-grid">
            {images.map((img, index) => {
              const isLastElement = images.length === index + 1;
              const isLoaded = loadedImages.has(img._id);
              return (
              <div 
                  className="image-card" 
                  key={img._id} 
                  ref={isLastElement ? lastImageElementRef : null}
              >
                <div className="image-wrapper">
                  {/* Native CSS Skeleton Pulse underlay */}
                  {!isLoaded && <div className="skeleton-overlay"></div>}
                  <img 
                      src={img.url} 
                      alt={img.filename} 
                      loading="lazy" 
                      onLoad={() => handleImageLoad(img._id)}
                      style={{ opacity: isLoaded ? 1 : 0 }}
                  />
                  <div className="image-overlay">
                    <div className="overlay-actions">
                        <button className="icon-btn" onClick={() => copyToClipboard(img.url)} title="Copy URL">
                          <i className="fa-solid fa-link"></i>
                        </button>
                        <a href={img.url} target="_blank" rel="noreferrer" className="icon-btn" title="Open Image">
                          <i className="fa-solid fa-expand"></i>
                        </a>
                        <button 
                          className="icon-btn delete-btn" 
                          onClick={() => handleDelete(img._id)} 
                          title="Delete Image"
                          disabled={deletingId === img._id}
                        >
                          {deletingId === img._id ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-trash-can"></i>
                          )}
                        </button>
                    </div>
                  </div>
                </div>
                <div className="image-details">
                  <div className="detail-row">
                    <span className="file-name" title={img.filename}>{img.filename}</span>
                  </div>
                  <div className="detail-row subtext">
                    <span>{formatSize(img.size)}</span>
                    <span>{format(new Date(img.uploadDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
          
          {loadingMore && (
              <div className="loading-more-spinner">
                   <div className="spinner-small"></div>
                   <span>Fetching more images...</span>
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;
