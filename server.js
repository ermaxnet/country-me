const app = require("./application");
const {
    mongooseConnect,
    collectionExists,
    Country
} = require("./database");
const { request } = require("./functions");

mongooseConnect(process.env.MONGODB_URI)
    .then(() => {
        return collectionExists("countries");
    })
    .then(exists => {
        if(exists) {
            return Promise.resolve();
        }
        Country.createIndexes()
            .then(() => {
                return request("https://restcountries.eu/rest/v2/all", { 
                    fields: "name;capital;region;subregion;population;area;flag;regionalBlocs;latlng;alpha2Code;alpha3Code" 
                });
            })
            .then(countries => {
                return Country.insertMany(countries);
            });
    })
    .then(() => {
        require("http").createServer(app).listen(
            (process.env.PORT || 3000),
            () => console.log(`Приложение было запущено на ${process.env.PORT || 3000} порту`)
        );
    })
    .catch(err => console.error(err));

