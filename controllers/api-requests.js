const AWS = require('aws-sdk');
s3 = new AWS.S3();

const { createBucketIfNotExists } = require('../helpers/s3-bucket-initialization-helper.js');

const uploadToS3AndProcessThumbnail = async (req, res) => {
    let { fileKey, filePath } = req.body;
    try {
        // Read the file from disk
        const fileContent = fs.readFileSync(filePath);

        // Create the parameters for calling createBucket
        var bucketName = `${process.env.PROJECT_NAME}-${process.env.AWS_REGION}`;

        //Create a bucket with the above name if not already exists
        createBucketIfNotExists(bucketName)
            .then(() => {
                console.log(`Bucket '${bucketName}' is ready to use.`);
            })
            .catch((error) => {
                return res.status(500).json({ msg: error.message });
            });

        // Set the parameters for uploading
        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: fileContent
        };

        // Upload the file to S3
        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`File uploaded successfully. File URL: ${data.Location}`);
            }
        });

        return res.status(200).json({ msg: `File successfully uploaded` });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { uploadToS3AndProcessThumbnail };