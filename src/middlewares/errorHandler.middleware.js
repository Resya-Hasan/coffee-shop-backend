const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.name === "ZodError") {
        const errors = err.issues.map((e) => {

            if (
                e.code === "invalid_type" &&
                e.message.includes("undefined")
            ) {
                return {
                    field: e.path[0],
                    message: `${e.path[0]} is required`,
                };
            }

            if (e.code === "invalid_type") {
                return {
                    field: e.path[0],
                    message: `Expected ${e.expected}`,
                };
            }

            if (e.code === "custom") {
                return {
                    field: "confirmPassword",
                    message: e.message,
                };
            }

            return {
                field: e.path[0],
                message: e.message,
            };
        });

        return res.status(400).json({
            message: "Validation Error",
            errors,
        });
    }

    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
            message: "Conflict Error",
            errors: err.errors.map((e) => ({
                field: e.path,
                message: e.message,
            })),
        });
    }

    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            message: "Validation Error",
            errors: err.errors.map((e) => ({
                field: e.path,
                message: e.message,
            })),
        });
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
            message: "Foreign Key Constraint Error",
            errors: [{
                field: err.index,
                message: err.message,
            }],
        });
    }

    if (err.name === "SequelizeDatabaseError") {
        return res.status(500).json({
            message: "Database Error",
            errors: [{
                message: err.message,
            }],
        });
    }

    res.status(500).json({
        message: "Internal Server Error",
    })
};

module.exports = {
    errorHandler,
};
