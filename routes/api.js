const { getCountryCode } = require("../functions");
const { Country } = require("../database");

module.exports = function(router) {

    router.get("/get-my-country", (req, res, next) => {
        getCountryCode(req.ip).then(country_code => {
            return Country.findOne({ $or: [
                { "alpha2Code": country_code },
                { "alpha3Code": country_code }
            ] });
        }).then(country => {
            if(country) {
                return res.status(201).json(country);
            }
            return next(new Error(`Sorry, we can't found your country.`));
        });
    });

    router.get("/get-random-country", (req, res, next) => {
        Country.aggregate([
            { $sample: { size: 1 } }
        ]).then(country => res.status(201).json(country[0]));
    });

    return router;
};