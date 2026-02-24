

const authorizationMiddleware = (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== "admin") {
        throw {
            name: "forbidden",
            message: "You do not have permission to access this resource"
        }
    }

    next();
}

module.exports = authorizationMiddleware;