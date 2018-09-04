const i18next = require("i18next");

i18next.init({
    lng: "en",
    resources: require("./en.json")
});

module.exports = i18next;