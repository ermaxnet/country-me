const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MinCssExtractPlugins = require("mini-css-extract-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinWebpackPlugin = require("imagemin-webpack-plugin").default;

const url_loader = {
    loader: "url-loader",
    options: {
        limit: 10000,
        name: "media/[name].[hash:8].[ext]"
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
    bail: true,
    entry: [
        require.resolve("./assets/scripts/polyfills.js"),
        "./assets/scripts/main.js",
        "./assets/scripts/components/Search.js",
        "./assets/scripts/components/Country.js",
        "./assets/scripts/components/Weather.js"
    ],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/main.[hash:8].js",
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
                            plugins: [ "@babel/plugin-proposal-class-properties" ],
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
                    },
                    {
                        loader: "file-loader",
                        exclude: [ /\.js$/, /\.html$/, /\.json$/, /\.pug$/ ],
                        options: {
                          name: "media/[name].[hash:8].[ext]",
                        },
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                test: /\.js$/,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        comparisons: false
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        comments: false,
                        ascii_only: true
                    },
                    sourceMap: true
                },
                cache: true,
                parallel: true
            }),
            new OptimizeCssAssetsWebpackPlugin({
                cssProcessorOptions: {
                    map: { inline: false }
                }
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "public")),
        new CopyWebpackPlugin([
            { from: "assets/images/favicon.ico", to: "media/favicon.ico" },
            { from: "assets/images/favicon.svg", to: "media/favicon.svg" },
            { from: "assets/images/apple-touch-icon.png", to: "media/apple-touch-icon.png" },
            { from: "assets/images/icons/weather.svg", to: "media/icons/weather.svg" }
        ]),
        new ImageMinWebpackPlugin({
            test: /\.svg$/,
            svgo: {
                plugins: [
                    { removeTitle: true },
                    { removeUselessDefs: false },
                    { cleanupIDs: {
                        remove: false
                    } }
                ]
            }
        }),
        new ImageMinWebpackPlugin({
            test: /\.png$/,
            optipng: {
                optimizationLevel: 9
            }
        }),
        new MinCssExtractPlugins({
            filename: "css/[name].[contenthash:8].css"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            filename: "index.pug",
            template: "./assets/templates/index.pug",
            hash: true,
            inject: true,
            links: [
                {
                    rel: "mask-icon",
                    sizes: "any",
                    href: "/media/favicon.svg",
                    color: "#1da1f2"
                },
                {
                    rel: "shortcut icon",
                    href: "/media/favicon.ico",
                    type: "image/x-icon"
                },
                {
                    rel: "apple-touch-icon",
                    href: "/media/apple-touch-icon.png",
                    sizes: "180x180"
                }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: "error500.pug",
            template: "./assets/templates/error500.pug",
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: "error404.pug",
            template: "./assets/templates/error404.pug",
            inject: false
        }),
        new HtmlWebpackPugPlugin(),
        new webpack.DefinePlugin({
            "process.env": Object.keys(process.env).filter(key => /^CLIENT_APP_/i.test(key)).reduce((vars, key) => {
                vars[key] = JSON.stringify(process.env[key]);
                return vars;
            }, {})
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    devtool: "source-map",
    performance: {
        hints: false
    }
};