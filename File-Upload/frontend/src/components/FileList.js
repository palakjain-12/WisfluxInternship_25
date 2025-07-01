import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileViewer from './FileViewer';
import './FileList.css';

const FileList = ({ refreshTrigger, onFileDelete }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data.files);
    } catch (err) {
      setError('Failed to fetch files: ' + (err.response?.data?.error || err.message));
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await axios.delete(`/api/files/${encodeURIComponent(filename)}`);
        setFiles(files.filter(file => file.filename !== filename));
        onFileDelete();
        
        // Close viewer if the deleted file was being viewed
        if (selectedFile && selectedFile.filename === filename) {
          setSelectedFile(null);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to delete file: ${errorMessage}`);
        console.error('Error deleting file:', err);
        
        // Show alert for immediate feedback
        alert(`Failed to delete file: ${errorMessage}`);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Unknown date';
    }
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    const imageExts = ['jpg', 'jpeg', 'png', 'gif'];
    const docExts = ['doc', 'docx'];
    const pdfExts = ['pdf'];
    const textExts = ['txt'];
    
    if (imageExts.includes(ext)) return '🖼️';
    if (docExts.includes(ext)) return '📄';
    if (pdfExts.includes(ext)) return '📕';
    if (textExts.includes(ext)) return '📝';
    return '📎';
  };

  const canPreviewFile = (filename) => {
    const ext = getFileExtension(filename);
    const previewableExts = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];
    return previewableExts.includes(ext);
  };

  const handleViewFile = async (file) => {
    // Test if file is accessible before opening viewer
    try {
      const response = await fetch(`/api/files/view/${encodeURIComponent(file.filename)}`, { 
        method: 'HEAD' 
      });
      if (response.ok) {
        setSelectedFile(file);
      } else {
        alert('File not found or cannot be accessed.');
      }
    } catch (err) {
      console.error('Error checking file accessibility:', err);
      alert('Cannot access file. It may have been deleted or moved.');
    }
  };

  const handleDownload = async (filename) => {
    try {
      // Test if file exists first
      const testResponse = await fetch(`/api/files/view/${encodeURIComponent(filename)}`, { 
        method: 'HEAD' 
      });
      
      if (!testResponse.ok) {
        alert('File not found or cannot be downloaded.');
        return;
      }

      // Proceed with download
      const downloadUrl = `/api/files/download/${encodeURIComponent(filename)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed. Please try again.');
    }
  };

  const closeViewer = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="file-list-container">
        <h2>Uploaded Files</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <h2>Uploaded Files</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={fetchFiles} 
            style={{ 
              marginLeft: '1rem', 
              padding: '0.25rem 0.5rem',
              border: '1px solid #e74c3c',
              background: 'white',
              color: '#e74c3c',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {files.length === 0 && !loading ? (
        <div className="no-files">
          <p>No files uploaded yet.</p>
          <p style={{ fontSize: '0.9rem', color: '#95a5a6', marginTop: '0.5rem' }}>
            Upload some files to see them here!
          </p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file, index) => (
            <div key={`${file.filename}-${index}`} className="file-card">
              <div className="file-icon">
                {getFileIcon(file.filename)}
              </div>
              
              <div className="file-info">
                <h3 className="file-name" title={file.filename}>
                  {file.filename}
                </h3>
                <p className="file-size">{formatFileSize(file.size)}</p>
                <p className="file-date">{formatDate(file.uploadDate)}</p>
              </div>
              
              <div className="file-actions">
                {canPreviewFile(file.filename) && (
                  <button
                    onClick={() => handleViewFile(file)}
                    className="action-button view-button"
                    title="View file"
                  >
                    👁️
                  </button>
                )}
                
                <button
                  onClick={() => handleDownload(file.filename)}
                  className="action-button download-button"
                  title="Download file"
                >
                  ⬇️
                </button>
                
                <button
                  onClick={() => handleDelete(file.filename)}
                  className="action-button delete-button"
                  title="Delete file"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {files.length > 0 && (
        <div className="files-summary">
          <p>Total files: {files.length}</p>
          <p>
            Total size: {formatFileSize(
              files.reduce((total, file) => total + file.size, 0)
            )}
          </p>
        </div>
      )}
      
      {selectedFile && (
        <FileViewer
          file={selectedFile}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};

export default FileList;