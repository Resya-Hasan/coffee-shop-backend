const express = require('express');
const multer = require('multer');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const authenticationMiddleware = require('./middlewares/authentication.middleware');

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));

app.use(authenticationMiddleware);

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/coffees', require('./routes/coffee.routes'));

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port} click http://localhost:${port}`);
});