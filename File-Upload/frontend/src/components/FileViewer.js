import React, { useState } from 'react';
import './FileViewer.css';

const FileViewer = ({ file, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = () => {
    const ext = getFileExtension(file.filename);
    // Use the API endpoint for viewing files
    const fileUrl = `/api/files/view/${encodeURIComponent(file.filename)}`;

    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={fileUrl}
            alt={file.filename}
            className="file-preview-image"
            onLoad={() => setLoading(false)}
            onError={(e) => {
              console.error('Image load error:', e);
              setError(true);
              setLoading(false);
            }}
          />
        );

      case 'pdf':
        return (
          <iframe
            src={fileUrl}
            className="file-preview-pdf"
            title={file.filename}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              console.error('PDF load error:', e);
              setError(true);
              setLoading(false);
            }}
          />
        );

      case 'txt':
        return (
          <iframe
            src={fileUrl}
            className="file-preview-text"
            title={file.filename}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              console.error('Text file load error:', e);
              setError(true);
              setLoading(false);
            }}
          />
        );

      default:
        setLoading(false); // No loading needed for unsupported files
        return (
          <div className="file-preview-unsupported">
            <div className="unsupported-icon">📄</div>
            <h3>Preview not available</h3>
            <p>This file type cannot be previewed in the browser.</p>
            <a
              href={`/api/files/download/${encodeURIComponent(file.filename)}`}
              className="download-button-large"
              onClick={(e) => {
                // Handle download errors
                e.target.addEventListener('error', () => {
                  alert('Download failed. Please try again.');
                });
              }}
            >
              Download to view
            </a>
          </div>
        );
    }
  };

  // Handle overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="file-viewer-overlay" onClick={handleOverlayClick}>
      <div className="file-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-viewer-header">
          <div className="file-info">
            <h3 title={file.filename}>{file.filename}</h3>
            <span className="file-size">
              {formatFileSize(file.size)}
            </span>
          </div>
          <div className="file-actions">
            <a
              href={`/api/files/download/${encodeURIComponent(file.filename)}`}
              className="action-btn download-btn"
              title="Download"
              onClick={(e) => {
                // Add error handling for download
                setTimeout(() => {
                  // Check if download started successfully
                  fetch(`/api/files/view/${encodeURIComponent(file.filename)}`, { method: 'HEAD' })
                    .catch(() => {
                      alert('File not found or download failed.');
                    });
                }, 1000);
              }}
            >
              ⬇️
            </a>
            <button
              onClick={onClose}
              className="action-btn close-btn"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="file-viewer-content">
          {loading && !error && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading preview...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Failed to load file preview</p>
              <p>The file might be corrupted or the server is not responding.</p>
              <a
                href={`/api/files/download/${encodeURIComponent(file.filename)}`}
                className="download-button-large"
              >
                Try downloading instead
              </a>
            </div>
          )}

          {!error && renderFileContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;