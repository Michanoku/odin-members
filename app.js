const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import Routes TODO
const indexRoutes = require('./routes/indexRoutes');

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for logging and so on
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Formdata and JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Cookies
app.use(cookieParser());

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Theme Toggle TODO

// App use routes TODO
app.use("/", indexRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    errorTitle: 404,
    errorMessage: "This page does not exist.",
  });
});

// Error Handler TODO

module.exports = app;