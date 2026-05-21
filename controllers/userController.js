const bcrypt = require("bcryptjs");
const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const passport = require("passport");
const db = require("../db/userQueries");

const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .bail()
    .isLength({ max: 64 })
    .withMessage(`First name must not be longer than 64 characters.`),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .bail()
    .isLength({ max: 64 })
    .withMessage(`Last name must not be longer than 64 characters.`),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage(`Email must be a valid email address.`),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 12, max: 72 })
    .withMessage(`Password must be between 12 and 72 characters.`),
  body("confirmation")
    .trim()
    .notEmpty()
    .withMessage("Confirmation is required.")
    .bail()
    .custom((value, { req }) => {
      const confirmation = req.body.password === value;
      if (!confirmation) {
        throw new Error("Confirmation does not match password.");
      }
      return true;
    }),
];

const validateLogin = [
  body("email").trim().notEmpty().withMessage("Email is required."),
  body("password").trim().notEmpty().withMessage("Password is required."),
];

const getRegister = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("users/register", { title: "User Registration" });
};

const postRegister = [
  validateRegister,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("users/register", {
        title: "User Registration",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, password } = matchedData(req);
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.createUser({ firstName, lastName, email, hash });
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  },
];

const getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("users/login", { title: "User Login" });
};

const postLogin = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("users/login", {
        title: "User Login",
        errors: errors.array(),
      });
    }
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
];

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
};
