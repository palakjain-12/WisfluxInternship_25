async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');
    
    if (!fileInput.files[0]) {
        showStatus('Please select a file', 'error');
        return;
    }

    const file = fileInput.files[0];
    showStatus('Preparing upload...', 'loading');

    try {
        // Get pre-signed URL
        const response = await fetch('/api/files/upload-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get upload URL');
        }

        showStatus('Uploading file...', 'loading');

        // Upload file directly to S3
        const uploadResponse = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (uploadResponse.ok) {
            showStatus(`File uploaded successfully! Download URL: ${data.downloadUrl}`, 'success');
            fileInput.value = '';
            loadFiles(); // Refresh file list
        } else {
            throw new Error('Upload failed');
        }

    } catch (error) {
        showStatus(`Upload failed: ${error.message}`, 'error');
    }
}

async function loadFiles() {
    const filesDiv = document.getElementById('filesList');
    filesDiv.innerHTML = '<p>Loading files...</p>';

    try {
        const response = await fetch('/api/files/list');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load files');
        }

        if (data.files.length === 0) {
            filesDiv.innerHTML = '<p>No files uploaded yet.</p>';
            return;
        }

        filesDiv.innerHTML = data.files.map(file => `
            <div class="file-item">
                <div class="file-name">${file.key}</div>
                <div class="file-info">
                    Size: ${formatFileSize(file.size)} | 
                    Modified: ${new Date(file.lastModified).toLocaleDateString()}
                </div>
                <button onclick="downloadFile('${file.key}')">Download</button>
                <button onclick="deleteFile('${file.key}')" style="background: #dc3545;">Delete</button>
                <button onclick="copyUrl('${file.downloadUrl}')">Copy URL</button>
            </div>
        `).join('');

    } catch (error) {
        filesDiv.innerHTML = `<p>Error loading files: ${error.message}</p>`;
    }
}

async function downloadFile(fileKey) {
    try {
        const response = await fetch(`/api/files/download/${fileKey}`);
        const data = await response.json();

        if (response.ok) {
            window.open(data.downloadUrl, '_blank');
        } else {
            alert('Failed to generate download URL');
        }
    } catch (error) {
        alert('Error downloading file: ' + error.message);
    }
}

async function deleteFile(fileKey) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }

    try {
        const response = await fetch(`/api/files/${fileKey}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('File deleted successfully');
            loadFiles();
        } else {
            alert('Failed to delete file');
        }
    } catch (error) {
        alert('Error deleting file: ' + error.message);
    }
}

function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load files when page loads
document.addEventListener('DOMContentLoaded', loadFiles);