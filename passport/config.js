const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/userQueries");

const customFields = {
  usernameField: "email",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await db.findUserByEmail(username);
    if (!user) {
      return done(null, false);
    }

    const match = await bcrypt.compare(password, user.hash);
    if (match) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.findUserById(userId);
    if (user) {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
});
