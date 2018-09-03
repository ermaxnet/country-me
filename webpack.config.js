const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MinCssExtractPlugins = require("mini-css-extract-plugin");

const url_loader = {
    loader: "url-loader",
    options: {
        limit: 10000,
        name: "media/[name].[ext]"
    }
};

const css_loaders = [
    {
        loader: MinCssExtractPlugins.loader
    },
    {
        loader: "css-loader",
        options: {
            sourceMap: true
        }
    },
    {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: (loader) => [
                require("postcss-flexbugs-fixes"),
                require("autoprefixer")({
                    browsers: [
                        ">1%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9"
                    ],
                    flexbox: 'no-2009'
                })
            ],
            sourceMap: true
        }
    }
];

module.exports = {
    entry: [
        require.resolve("webpack-hot-middleware/client"),
        "./assets/scripts/main.js",
        "./assets/scripts/components/Search.js"
    ],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/main.js",
        publicPath: "/"
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "assets/images"),
            path.resolve(__dirname, "assets/styles")
        ],
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.svg$/,
                        use: [
                            url_loader,
                            {
                                loader: "svgo-loader",
                                options: {
                                    plugins: [
                                        { removeTitle: true }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
                        ...url_loader
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        options: {
                            presets: [ "@babel/preset-env", "@babel/preset-react" ],
                            cacheDirectory: true
                        }
                    },
                    {
                        test: /\.css$/,
                        use: css_loaders
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            ...css_loaders,
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "public")),
        new MinCssExtractPlugins({
            filename: "css/[name].css"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            filename: "index.pug",
            template: "./assets/templates/index.pug",
            hash: true
        }),
        new HtmlWebpackPugPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "cheap-source-map",
    performance: {
        hints: false
    }
};