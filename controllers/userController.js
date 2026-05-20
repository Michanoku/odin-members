const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/userQueries");

const getRegister = (req, res) => {
    res.render("users/register", { title: "User Registration"});
}

const postRegister = (req, res) => {
    // TODO VALIDATION & SANITATION
    // CREATE USER IN DB
    // SEND ON
}

module.exports = {
    getRegister,
    postRegister,
}