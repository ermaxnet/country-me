module.exports = function(router) {
    router.get("/", (req, res, next) => {
        res.render("index", {
            title: "Hello, Pug"
        });
    });
    return router;
};