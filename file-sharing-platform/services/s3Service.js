// services/s3Service.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class S3Service {
  // Generate pre-signed URL for upload
  async getUploadUrl(filename, filetype) {
    const key = `uploads/${uuidv4()}-${filename}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: filetype,
      Expires: 300, // 5 minutes
      ACL: 'private'
    };

    try {
      const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
      return { uploadUrl, key };
    } catch (error) {
      throw new Error('Failed to generate upload URL');
    }
  }

  // Generate pre-signed URL for download
  async getDownloadUrl(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600 // 1 hour
    };

    try {
      const downloadUrl = await s3.getSignedUrlPromise('getObject', params);
      return downloadUrl;
    } catch (error) {
      throw new Error('Failed to generate download URL');
    }
  }

  // Delete file from S3
  async deleteFile(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  }

  // Check if file exists
  async fileExists(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    try {
      await s3.headObject(params).promise();
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new S3Service();