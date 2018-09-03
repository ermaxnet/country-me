const app = require("./application");
const {
    mongooseConnect,
    collectionExists,
    Country
} = require("./database");
const { request } = require("./functions");

mongooseConnect(process.env.MONGOLAB_URI)
    .then(() => {
        return collectionExists("countries");
    })
    .then(exists => {
        if(exists) {
            return Promise.resolve();
        }
        return request("https://restcountries.eu/rest/v2/all", { 
            fields: "name;capital;region;subregion;population;area;flag;regionalBlocs;latlng" 
        }).then(countries => {
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

