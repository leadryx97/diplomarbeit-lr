const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/app.js",
    plugins: [new HTMLWebpackPlugin({
        template: "./src/index.html"
    })],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                type: 'asset/resource',
            },
        ],
    },
};
