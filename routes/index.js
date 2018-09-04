const locale = require("../locales");

module.exports = function(router) {
    router.get("/", (req, res) => {
        res.render("index", {
            title: locale.t("title")
        });
    });
    return router;
};