const express = require('express');
const router = express.Router();

const { uploadToS3AndProcessThumbnail } = require('../controllers/api-requests.js');

// console.log("Hello From Router");
router.route('/').post(uploadToS3AndProcessThumbnail);

module.exports = router;