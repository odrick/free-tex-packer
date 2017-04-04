var path = require('path');

module.exports = {
    entry: [
        'babel-polyfill',
		'./src/client/index',
        'webpack-dev-server/client?http://localhost:4000'
    ],
    output: { filename: 'static/js/index.js' },
    debug: true,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: 'babel-loader',
                query: {presets: ["react", "es2015", "stage-0"]}
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: 'babel-loader',
                query: { presets: ["es2015", "stage-0"] }
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.(html|htm)$/, loader: 'dom' }
        ],
        noParse: /.*[\/\\]bin[\/\\].+\.js/
    },
    devServer: { contentBase: path.resolve(__dirname, "dist") }
};