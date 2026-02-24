const { z } = require("zod");

const createCoffeeSchema = z.object({
    name: z.string({ required_error: "Name is required", invalid_type_error: "Name must be a string" }).min(1, "Name is Required"),
    description: z.string({ required_error: "Description is required", invalid_type_error: "Description must be a string" }).min(1, "Description is Required"),
    productInformation: z.string({ required_error: "Product information is required", invalid_type_error: "Product information must be a string" }).min(1, "Product information is Required"),
    price: z.number({ required_error: "Price is required", invalid_type_error: "Price must be a number" }).positive("Price must be a positive number"),
    stock: z.number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" }).int("Stock must be an integer").nonnegative("Stock cannot be negative"),
});