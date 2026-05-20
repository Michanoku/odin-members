const bcrypt = require("bcryptjs");
const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/userQueries");

const validateUser = [
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
        throw new Error('Confirmation does not match password.');
        }
        return true;
    }),
];

const getRegister = (req, res) => {
    res.render("users/register", { title: "User Registration"});
}

const postRegister = [
    validateUser,
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("users/register", {
            title: "User Registration",
            errors: errors.array(),
      });
    }
    const { firstName, lastName, email, password } = matchedData(req);
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = db.createUser({ firstName, lasName, email, hash });
    // LOGIN USER IMMEDIATELY (TODO)
    res.redirect("/");
},
];

module.exports = {
    getRegister,
    postRegister,
}