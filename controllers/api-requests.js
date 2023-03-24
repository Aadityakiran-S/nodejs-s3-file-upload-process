const uploadToS3AndProcessThumbnail = async (req, res) => {
    console.log("Hello");
    let { filekey, filePath } = req.body;
    try {
        return res.status(200).json({ msg: `File Key: ${filekey} and FilePath: ${filePath}` });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = { uploadToS3AndProcessThumbnail };