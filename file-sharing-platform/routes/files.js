const express = require('express');
const router = express.Router();
const s3 = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

// Generate pre-signed URL for upload
router.post('/upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    const fileKey = `${uuidv4()}-${fileName}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      Expires: 300 // URL expires in 5 minutes
    };

    const uploadUrl = s3.getSignedUrl('putObject', params);
    
    res.json({
      uploadUrl,
      fileKey,
      downloadUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Generate pre-signed URL for download
router.get('/download/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 3600 // URL expires in 1 hour
    };

    const downloadUrl = s3.getSignedUrl('getObject', params);
    
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// List all files
router.get('/list', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME
    };

    const data = await s3.listObjectsV2(params).promise();
    
    const files = data.Contents.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      downloadUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
    }));

    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Delete file
router.delete('/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey
    };

    await s3.deleteObject(params).promise();
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;