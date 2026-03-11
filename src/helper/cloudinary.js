const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary.config');
const upload = require('../config/upload.config');

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                timeout: 60000
            },
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
} 

const uploadWithRetry = async (Buffer, folder, retries= 3) => {
    try {
        return await uploadToCloudinary(Buffer, folder);
    } catch (err) {
        if (retries === 0 ) throw err;
        return await uploadWithRetry(Buffer, folder, retries - 1);
    }
}

module.exports = { uploadToCloudinary, uploadWithRetry };