const Schema = require("mongoose").Schema;
const CountrySchema = new Schema({
    name: String,
    capital: String,
    region: String,
    subregion: String,
    population: {
        type: Number,
        default: 0
    },
    area: {
        type: Number,
        default: 0
    },
    latlng: {
        type: {
            lat: Number,
            lon: Number
        },
        alias: "coordinates"
    },
    flag: String,
    regionalBlocs: [
        {
            acronym: String,
            name: String
        }
    ]
});
module.exports = CountrySchema;