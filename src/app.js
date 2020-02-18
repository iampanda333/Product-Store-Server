const express = require('express');
require('./db/mongoose');
const cors = require('cors');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const middleware = require('./middleware/helper');

const app = express();


// Middleware
app.use(cors());

app.use(express.json());

app.use(middleware.validateToken);

app.use(productRouter);
app.use(userRouter);

module.exports = app;