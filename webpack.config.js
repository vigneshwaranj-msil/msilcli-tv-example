const path = require("path"),
    fs = require("fs"),
    webpack = require("webpack"),
    cssExtractPlugin = require("extract-css-chunks-webpack-plugin"),
    htmlWebpackPlugin = require("html-webpack-plugin"),
    htmlPartialsPlugin = require("html-webpack-partials-plugin"),
    copyPlugin = require("copy-webpack-plugin"),
    cleanWebpack = require("clean-webpack-plugin"),
    terserPlugin = require("terser-webpack-plugin"),
    { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
module.exports = function(env) {
    const isProduction = env.prod || false,
        srcDirectory = path.resolve(__dirname, "src"),
        deploymentDirectory = path.resolve(
            __dirname,
            isProduction ? "dist" : "dev"
        ),
        environmentVariable = {
            url: {
                symbolSearch: "http://localhost:8010/proxy/search/",
                feed: "http://localhost:8010/proxy/quotes/hist"
            }
        },
        loaders = {
            babel: {
                loader: "babel-loader",
                options: {
                    babelrc: false
                }
            }
        },
        // This logic is to check if index.ts is available then make use of index.ts else use index.js as an entry point
        getAppLocation = isTypeScript => path.resolve(srcDirectory, `index.${isTypeScript ? "ts" : "js"}`);
    return {
        target: "web",
        mode: isProduction ? "production" : "development",
        entry: {
            polyfill: path.resolve(srcDirectory, "polyfill.js"),
            app: fs.existsSync(getAppLocation(true)) ? getAppLocation(true) : getAppLocation(false),
        },
        output: {
            path: deploymentDirectory,
            filename: "js/[name].[contenthash].js",
            chunkFilename: "js/[name].[contenthash].js"
        },
        module: {
            rules: [{
                    test: /\.ts(x)?$/,
                    exclude: [/node_modules/],
                    use: [loaders.babel, "ts-loader"]
                },
                {
                    test: /\.js(x)?$/,
                    exclude: [/node_modules/],
                    use: [loaders.babel]
                },
                {
                    test: /\.(s)?css$/,
                    use: [{
                            loader: cssExtractPlugin.loader,
                            options: {
                                publicPath: "css/",
                                hmr: isProduction
                            }
                        },
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(jp(e)?g|gif|png|svg|txt|json|cur)$/,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: function(url) {
                                return "css/img/" + url;
                            },
                            publicPath: "img/"
                        }
                    }]
                }
            ]
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 1000,
                name: false,
                cacheGroups: {
                    components: {
                        name: "components",
                        priority: 40,
                        test: /[\\/]js([\\/]\w{3,})?[\\/]component(s)?/
                    },
                    vendor: {
                        name: "vendor",
                        priority: 20,
                        test: /node_modules/
                    },
                    thirdparty: {
                        name: "thirdparty",
                        priority: 30,
                        test: /[\\/]thirdparty/
                    },
                    feeds: {
                        name: "feeds",
                        priority: 40,
                        test: /[\\/]js[\\/](feeds|market)/
                    },
                    utils: {
                        name: "utils",
                        priority: 50,
                        test: /[\\/]js[\\/]utils/
                    }
                }
            }
        },
        plugins: [
            new htmlWebpackPlugin({
                template: path.resolve(srcDirectory, "index.html"),
                title: "Chart's Implementation",
                favicon: path.resolve(srcDirectory, "favicon.png")
            }),
            new htmlPartialsPlugin({
                path: path.resolve(srcDirectory, "content.html"),
                location: "body"
            }),
            new copyPlugin({
                patterns: [{
                        from: path.resolve(
                            srcDirectory,
                            "thirdparty",
                            "bundles"
                        ),
                        to: path.resolve(
                            deploymentDirectory,
                            "js",
                            "thirdparty"
                        )
                    },
                    {
                        from: path.resolve(
                            srcDirectory,
                            "js",
                            "market",
                            "marketRules.json"
                        ),
                        to: path.resolve(
                            deploymentDirectory,
                            "marketRules.json"
                        )
                    }
                ]
            }),
            new webpack.ProgressPlugin(),
            new BundleAnalyzerPlugin({ openAnalyzer: false }),
            new terserPlugin({
                extractComments: true,
                terserOptions: {
                    ecma: 2015,
                    safari10: true,
                    ie8: true,
                    compress: {
                        // eslint-disable-next-line camelcase
                        drop_console: isProduction,
                        arrows: false
                    },
                    mangle: true,
                    // eslint-disable-next-line camelcase
                    keep_classnames: false,
                    sourceMap: false,
                    format: {
                        safari10: true,
                        semicolons: true
                    }
                }
            }),
            new webpack.DefinePlugin({
                __TREE_SHAKE__: JSON.stringify(isProduction),
                process: JSON.stringify({
                    env: environmentVariable
                })
            }),
            new cssExtractPlugin({
                filename: "css/[name].[hash].css",
                chunkFilename: "css/[name].[hash].css"
            }),
            new cleanWebpack.CleanWebpackPlugin()
        ],
        resolve: {
            alias: {
                chartLibrary: path.resolve(srcDirectory, "thirdparty")
            },
            extensions: [".js", ".ts", ".jsx", ".tsx"]
        }
    };
};