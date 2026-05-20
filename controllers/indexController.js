const index = (req, res) => {
    res.render("index", { title: "Entrance"});
};

const testError = (req, res, next) => {
  next(new Error('Intentional test error'));
};

module.exports = {
    index,
    testError,
}