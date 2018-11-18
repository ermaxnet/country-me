const { 
    getCountryCode, 
    getCountryWeather, 
    getCountryPhotos 
} = require("../functions");
const { Country } = require("../database");
const CountryApiException = require("../infrastructure/exceptions/CountryApiException");

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
            return next(new CountryApiException(`Sorry, we can't found your country.`, 404, null, req));
        }).catch(err => next(new CountryApiException(
            `Method: /get-my-country. Ip: ${req.ip}`,
            500, err, req
        )));
    });

    router.get("/get-random-country", (req, res, next) => {
        Country.aggregate([
            { $sample: { size: 1 } }
        ])
            .then(country => res.status(201).json(country[0]))
            .catch(err => next(new CountryApiException(
                `Method: /get-random-country.`,
                500, err, req
            )));
    });

    router.get("/get-country-by-code", (req, res, next) => {
        return Country.findOne({ $or: [
            { "alpha2Code": req.query.country_code },
            { "alpha3Code": req.query.country_code }
        ] }).then(country => {
            if(country) {
                return res.status(201).json(country);
            }
            return next(new CountryApiException(`Sorry, we can't found your country.`, 404, null, req));
        }).catch(err => next(new CountryApiException(
            `Method: /get-country-by-code. Query: ${req.query}.`,
            500, err, req
        )));
    });

    router.get("/search", (req, res, next) => {
        Country.aggregate([
            { $match: { $or: [
                { name: { $regex: `^${req.query.match}`, $options: "i" } },
                { capital: { $regex: `^${req.query.match}`, $options: "i" } }
            ] } },
            { $sample: { size: 5 } },
            { $sort: { population: 1 } }
        ]).then(countries => {
            res.json(countries);
        }).catch(err => next(new CountryApiException(
            `Method: /search. Query: ${req.query}.`,
            500, err, req
        )));
    });

    router.get("/weather", (req, res, next) => {
        getCountryWeather(req.query.lat, req.query.lng)
            .then(weather => {
                return res.status(201).json(weather);
            })
            .catch(err => next(new CountryApiException(
                `Method: /weather. Query: ${req.query}.`,
                500, err, req
            )));
    });

    router.get("/get-country-photos", (req, res, next) => {
        getCountryPhotos(req.query.name, req.query.capital)
            .then(({ photos: { photo: photos } }) => {
                return res.status(201).json(photos);
            })
            .catch(err => next(new CountryApiException(
                `Method: /get-country-photos. Query: ${req.query}.`,
                500, err, req
            )));
    });

    return router;
};