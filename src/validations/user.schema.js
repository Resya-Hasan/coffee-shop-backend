const z = require("zod");

const registerSchema = z.object({
    name: z.string({ required_error: "Name is required", invalid_type_error: "Name must be a string" }).min(1, "Name is Required"),
    email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string({ required_error: "Confirm Password is required", invalid_type_error: "Confirm Password must be a string" }).min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
})

const loginSchema = z.object({
    email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(6, "Password must be at least 6 characters long"),
})

module.exports = {
    registerSchema,
    loginSchema
}