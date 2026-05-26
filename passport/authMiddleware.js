const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.member) {
    next();
  } else if (req.isAuthenticated()) {
    res.redirect("/join");
  } else {
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else if (req.isAuthenticated()) {
    res.redirect("/join");
  } else {
    res.redirect("/login");
  }
};

module.exports = {
  isAuth,
  isMember,
  isAdmin,
};
