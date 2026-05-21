const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
require("./passport/config");
const path = require("path");
const pool = require("./db/pool");

// Import Routes TODO
const indexRoutes = require("./routes/indexRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for logging and so on
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Formdata and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookies & Session
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session"
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Initialize passport session
app.use(passport.initialize());
app.use(passport.session());

// Logging of session
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Store user in locals (if any)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Theme Toggle TODO

// App use routes TODO
app.use("/", indexRoutes);
app.use("/", userRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    errorTitle: 404,
    errorMessage: "This page does not exist.",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).render("error", {
    title: "Error",
    errorTitle: status,
    errorMessage: err.message || "Something went wrong.",
  });
});

module.exports = app;
