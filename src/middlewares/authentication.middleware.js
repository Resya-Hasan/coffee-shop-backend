const { verifyToken } = require("../utils/jwt");


const authenticationMiddleware = (req, res, next ) => {
    const access_token = req.headers.authorization

    if (!access_token) {
        throw {
            name: "unauthorized",
            message: "Invalid token"
        }
    }

    if (!access_token.startsWith("Bearer ")) {
        throw {
            name: "unauthorized",
            message: "Invalid token format"
        }
    }

    const token = access_token.split(" ")[1];

    if (!token) {
        throw {
            name: "unauthorized",
            message: "Token not found"
        }
    }

    const isVerified = verifyToken(token);

    if (!isVerified) {
        throw {
            name: "unauthorized",
            message: "Invalid token"
        }
    }

    req.user = {
        id: isVerified.id,
    }

    console.log(req.user, "<<<<<");

    next()
}

module.exports = authenticationMiddleware;