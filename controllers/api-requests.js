const AWS = require('aws-sdk');
const fs = require('fs');
s3 = new AWS.S3();

const { processImageToThumbnail } = require('../helpers/thumbnail-processing-helper.js');
const { createBucketIfNotExists } = require('../helpers/s3-bucket-initialization-helper.js');
let bucketParams;

const uploadToS3AndProcessThumbnail = async (req, res) => {
    let { fileKey, filePath } = req.body;
    try {
        // Read the file from disk
        const imageBuffer = fs.readFileSync(filePath);

        // Create the parameters for calling createBucket
        var bucketName = `${process.env.PROJECT_NAME}-${process.env.AWS_REGION}`;

        //#TOASK: then() and all that.... I don't really understand promises, could you explain? Or could this just be written in a try catch like we always do?
        //Create a bucket with the above name if not already exists
        createBucketIfNotExists(bucketName)
            .then(() => {
                console.log(`Bucket '${bucketName}' is ready to use.`);
            })
            .catch((error) => {
                return res.status(500).json({ msg: error.message });
            });

        // Set the parameters for uploading image
        bucketParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: imageBuffer
        };

        // Upload the file to S3
        s3.upload(bucketParams, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Image uploaded successfully. File URL: ${data.Location}`);
            }
        });

        let thumbnailBuffer = await processImageToThumbnail(imageBuffer);
        if (thumbnailBuffer.success === false) {
            return res.status(500).json({ msg: `Thumbnail size is too big` });
        }

        // Set the parameters for uploading image
        bucketParams = {
            Bucket: bucketName,
            Key: `${fileKey.split('.')[0]}_thumbnail.jpeg`,
            Body: thumbnailBuffer.content,
            ContentType: 'image/jpeg'
        };

        // Upload the file to S3
        s3.upload(bucketParams, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Thumbnail uploaded successfully. File URL: ${data.Location}`);
            }
        });

        return res.status(200).json({ msg: `Image and thumbnail sucessfully processed and uploaded` });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { uploadToS3AndProcessThumbnail };