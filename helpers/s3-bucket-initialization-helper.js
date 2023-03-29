const AWS = require('aws-sdk');
require('dotenv').config();

// Create S3 service object
const s3 = new AWS.S3();

const createBucketIfNotExists = async (bucketName) => {
    try {
        const response = await s3.headBucket({ Bucket: bucketName }).promise();
        console.log(`Bucket '${bucketName}' already exists.`);
        return response;
    } catch (error) {
        if (error.statusCode === 404) {
            console.log(`Bucket '${bucketName}' does not exist. Creating it now...`);
            await s3.createBucket({ Bucket: bucketName }).promise();
            console.log(`Bucket '${bucketName}' created successfully.`);
        } else {
            throw error;
        }
    }
};

module.exports = { createBucketIfNotExists };