const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

const routes = require("./routes");

// Load environment variables
dotenv.config({
  path: path.resolve(
    __dirname,
    "config",
    `${process.env.NODE_ENV || "development"}.env`
  ),
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set up routes
app.get("/", (req, res) => {
  res.send("Hello World! Serverless function. ci/cd");
});

routes.forEach((route) => {
  app.use(route.path, route.router);
});

module.exports = app;
