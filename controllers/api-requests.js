const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');

const { processImageToThumbnail } = require('../helpers/thumbnail-processing-helper.js');

let bucketParams;

const uploadToS3AndProcessThumbnail = async (req, res) => {
    let { fileKey } = req.body;
    let imageBinary = fs.readFileSync(req.file.path); //#TOASK: This thing is returning undefined. What gives? Also what's object destrucring and why does this have to do 
    try {
        // Create the parameters for calling createBucket
        var bucketName = `${process.env.PROJECT_NAME}-${process.env.AWS_REGION}`;

        // Set the parameters for uploading image
        bucketParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: imageBinary
        };

        console.log(`FileKey: ${fileKey}, FileBinary ${(JSON.stringify(req.file))}`);
        console.log(`File path ${(JSON.stringify(req.file.path))}`);

        // Upload the file to S3
        s3.upload(bucketParams, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Image uploaded successfully. File URL: ${data.Location}`);
            }
        });

        console.log("Hello 2");

        let thumbnailBuffer = await processImageToThumbnail(imageBinary);
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
        console.log("Goodbye");
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { uploadToS3AndProcessThumbnail };