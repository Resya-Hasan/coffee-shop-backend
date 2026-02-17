const upload = require('../config/upload.config');

const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                err.name = "bad_request";
                return next(err);
            }
            next();
        })
    }
}

module.exports = {
    uploadSingle,
}