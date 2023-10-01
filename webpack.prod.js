const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'assets/[name]-[hash][ext]'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
    ],
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                generator: [{
                    preset: "webp",
                    implementation: ImageMinimizerPlugin.sharpGenerate,
                    options: {
                        encodeOptions: {
                            webp: {
                                quality: 90,
                            },
                        },
                    },
                },
                {
                    preset: "avif",
                    implementation: ImageMinimizerPlugin.sharpGenerate,
                    options: {
                        encodeOptions: {
                            avif: {
                                // level 1 - 63
                                cqlevel: 50,
                            },
                        },
                    },
                },
                ],
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                quality: 90,
                            },
                            png: {
                                quality: 90,
                            },
                        },
                    },
                },
            }),
        ],
    },
});