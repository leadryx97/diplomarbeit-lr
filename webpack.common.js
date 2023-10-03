const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const includePreprocessor = (content, loaderContext) => {
  return content.replace(
    /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi,
    (m, src) => {
      const filePath = path.resolve(loaderContext.context, src);
      loaderContext.dependency(filePath);
      return fs.readFileSync(filePath, "utf8");
    }
  );
};

const pages = ["index", "aktuelles", "objekt", "newsdetail", "kontakt"];

module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/js/${page}.js`;
    return config;
  }, {}),
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            preprocessor: includePreprocessor,
          },
        },
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()].concat(
    pages.map(
      (page) =>
        new HTMLWebpackPlugin({
          inject: true,
          template: `./src/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  ),
};
