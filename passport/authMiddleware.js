const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).redirect("/login");
    } 
}

const isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.member) {
        next();
    } else if (req.isAuthenticated()) {
        res.status(401).redirect("/join");
    } else {
        res.status(401).redirect("/login");
    }
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else if (req.isAuthenticated()) {
        res.status(401).redirect("/join");
    } else {
        res.status(401).redirect("/login");
    }
}

module.exports = {
    isAuth,
    isMember,
    isAdmin,
}