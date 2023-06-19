const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet);
app.use(limiter);

app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
