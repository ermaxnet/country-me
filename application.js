const path = require("path");
const express = require("express");
const app = express();

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

module.exports = app;