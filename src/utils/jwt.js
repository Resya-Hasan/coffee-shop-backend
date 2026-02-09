const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })

    return token;
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch(err) {
        console.error(err);
        throw new Error('Invalid token');
    }
}

module.exports = {
    generateToken,
    verifyToken
};