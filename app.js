const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/router.js');
const { createBucketIfNotExists } = require('./helpers/s3-bucket-initialization-helper.js');

//using inbuilt middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting up direction to router
app.use('/api/v1/process-file', router);

const port = process.env.PORT || 3000;
const start = (portToListen) => {
    try {
        app.listen(port, () => {
            console.log(`server is listening on port ${portToListen}......`);
        })
    } catch (error) {
        console.log(error);
    }
};

start(port);

var bucketName = `${process.env.PROJECT_NAME}-${process.env.AWS_REGION}`;
createBucketIfNotExists(bucketName)
    .then(() => {
        console.log(`Bucket ${bucketName} is ready to use`);
    })
    .catch(() => {
        console.error(`Error occured when creating bucket ${bucketName}`);
    });


module.exports = app;