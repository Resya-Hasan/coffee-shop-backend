require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const authenticationMiddleware = require('./middlewares/authentication.middleware');
const cors = require('cors');
const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));

app.use(authenticationMiddleware);

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/carts', require('./routes/cart.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port} click http://localhost:${port}`);
});