const path = require("path");
const express = require("express");
const app = express();
const locale = require("./locales");
const CountryApiException = require("./infrastructure/exceptions/CountryApiException");

const { APPLICATION_ENVIRONMENT = null } = process.env; 
if(APPLICATION_ENVIRONMENT === "development") {
    const webpackCompiler = require("webpack")({
        mode: "development",
        ...require("./webpack.config")
    });
    app.use(require("webpack-dev-middleware")(webpackCompiler, {
        publicPath: "/",
        writeToDisk: true,
        noInfo: true
    }));
    app.use(require("webpack-hot-middleware")(webpackCompiler));
}

app.use(express.static(path.resolve(__dirname, "public")));

app.set("trust proxy", true);
app.set("views", path.resolve(__dirname, "public"));
app.set("view engine", "pug");

app.use("/api", require("./routes/api")(express.Router()));
app.use("/", require("./routes")(express.Router()));

app.use((req, res, next) => {
    return res.status(404).render("error404", {
        title: locale.t("title-404")
    });
});

app.use((err, req, res, next) => {
    if (err instanceof CountryApiException) {
        return res.status(err.code).json({
            message: err.message,
            code: err.code
        });
    }
    return res.status(400).render("error500", {
        title: locale.t("title-500")
    });
});

module.exports = app;