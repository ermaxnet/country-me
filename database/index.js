const mongoose = require("mongoose");
const CountrySchema = require("./schemas/country");

const Country = mongoose.model("Country", CountrySchema);

function mongooseConnect(connectionString) {
    return mongoose.connect(connectionString, { 
        useNewUrlParser: true,
        autoIndex: false
    });
};

function mongooseDisconnect() {
    return mongoose.connection.close();
};

function collectionExists(name) {
    return mongoose.connection.db.listCollections({ name }).next();
};

module.exports = {
    mongooseConnect,
    mongooseDisconnect,
    collectionExists,
    Country
};