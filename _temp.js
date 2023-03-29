const AWS = require('aws-sdk');
require('dotenv').config();

// Create S3 service object
s3 = new AWS.S3();

// Create the parameters for calling createBucket
var bktName = `${process.env.PROJECT_NAME}-${process.env.AWS_REGION}`;

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

createBucketIfNotExists(bktName)
    .then(() => {
        console.log(`Bucket '${bktName}' is ready to use.`);
    })
    .catch((error) => {
        console.error(`Error occurred: ${error.message}`);
    });