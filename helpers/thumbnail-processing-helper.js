const sharp = require('sharp');
const fs = require('fs');

let outputObj = { success: false, message: `Yet to be intialized`, content: null };

// Process the image using Sharp
const processImageToThumbnail = async (buffer) => {
    try {
        //#TOASK: Is this the correct way to set the aspect ratio of an image? 
        //Processing once to change aspect ratio
        let thumbnailImage = await sharp(buffer)
            .resize({
                width: 1000, // set the width to 1000 pixels
                height: 500, // set the height to half of the width (1:2 aspect ratio)
                fit: 'fill', // specify how to fit the image in case it doesn't have the exact aspect ratio
                position: 'center' // specify where to position the image if there's any whitespace
            })
            .toFormat("jpeg", { mozjpeg: true })
            .toBuffer();

        // Reduce the quality setting until the output buffer is below 10KB
        let outputQuality = 90;
        while (thumbnailImage.length > 30000 /*#TOASK: How to prevent this hardcoding?*/ && outputQuality >= 10) {
            thumbnailImage = await sharp(buffer)
                .toFormat("jpeg", { mozjpeg: true })
                .jpeg({ quality: outputQuality })
                .toBuffer();
            outputQuality -= 10; /*#TOASK: Maybe rather than doing this, I can try to quality *= (0.9) or something till it eventually decreases in quality?*/
        }

        if (thumbnailImage.length > 30000) {
            console.log("Image still too big");
            outputObj.message = `Image is too big to convert to thumbnail within specified size`;

            return outputObj;
        }

        outputObj.success = true;
        outputObj.message = `Image successfully converted to thumbnail of appropriate size`;
        outputObj.content = thumbnailImage;

        return outputObj;
    } catch (error) {
        console.log(error);

        outputObj.success = false;
        outputObj.message = error;

        return outputObj;
    }
}

module.exports = { processImageToThumbnail };