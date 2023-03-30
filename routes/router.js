const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageUpload = multer({ dest: './uploads/', limits: { fileSize: 1000000 /* 1MB max upload size */ } }).single('imageBinary')
// #TOASK: So like this ./uploads folder will keep increasing, how do we prevent that?

const { uploadToS3AndProcessThumbnail } = require('../controllers/api-requests.js');

router.route('/').post(imageUpload, uploadToS3AndProcessThumbnail);

module.exports = router;