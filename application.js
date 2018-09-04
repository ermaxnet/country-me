const path = require("path");
const express = require("express");
const app = express();
const locale = require("./locales");

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
    res.status(404).render("error404", {
        title: locale.t("title-404")
    });
});

app.use((err, req, res, next) => {
    res.status(400).render("error500", {
        title: locale.t("title-500")
    });
});

module.exports = app;