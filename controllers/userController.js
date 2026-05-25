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

const validatePassword = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .custom((value, { req }) => {
      const secretPasswords = [
        req.user.member
        ? process.env.ADMIN_PASSWORD
        : process.env.MEMBER_PASSWORD,
        process.env.RESET_PASSWORD
      ];
      if (!secretPasswords.includes(value)) {
        throw new Error("Invalid secret password.");
      }
      return true;
    })
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

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const getJoin = (req, res) => {
  res.render("users/join", {
    title: "Join the club",
  })
}

const postJoin = [
  validatePassword,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("users/join", {
        title: "Join the club",
        errors: errors.array(),
      });
    }
    const { password } = matchedData(req);
    if (password === process.env.MEMBER_PASSWORD) {
      db.changeLevel(true, false, req.user.user_id);
    } else if (password === process.env.ADMIN_PASSWORD) {
      db.changeLevel(true, true, req.user.user_id);
    } else {
      db.changeLevel(false, false, req.user.user_id);
    }
    res.redirect("/");
  },
];

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getJoin,
  postJoin,
};
