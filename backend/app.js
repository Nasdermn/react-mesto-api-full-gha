const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");
const router = require("./routes");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect("mongodb://127.0.0.1/mestodb");

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(express.json());

app.use(limiter);
app.use(helmet());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
