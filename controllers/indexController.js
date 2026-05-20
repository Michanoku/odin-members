const index = (req, res) => {
    res.render("index", { title: "Entrance"});
};

module.exports = {
    index,
}