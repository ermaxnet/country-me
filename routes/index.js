const { getCountryCode } = require("../functions");
const { Country } = require("../database");

module.exports = function(router) {
    router.get("/", (req, res, next) => {
        const ip = req.headers["X-Forwarded-For"]
            || req.headers["X-Forwarded-For"]
            || req.client.remoteAddress;
        getCountryCode(ip).then(({ country_code }) => {
            return Country.findOne({ $or: [
                { "alpha2Code": country_code },
                { "alpha3Code": country_code }
            ] });
        }).then(country => {
            res.render("index", {
                title: "Hello, Pug",
                country
            });
        });
    });
    return router;
};