
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dirname } = require('path');
module.exports = {
    entry: path.resolve(__dirname, './src/js/Main.js'),
    module: {
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/assets", to: "assets" },
                { from: "src/lib", to: "lib" },
                { from: 'src/style.css', to: path.resolve(__dirname, 'dist') }
            ],
        }),
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    devServer: {
        server: 'http',
        port: 8080,
        hot: true,
        static: [
            {
                directory: path.join(__dirname, 'src'),
            }
        ],
        client: {
            overlay: true,
        }
    },
    target: "web",
    mode: "development",
};