var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var argv = require('optimist').argv;

var entry = [
    'babel-polyfill',
    './src/client/index'
];

var plugins = [];

var devtool = 'eval-source-map';
var output = 'static/js/index.js';
var debug = true;

var PLATFORM = argv.platform || 'web';
var NODE_ENV = argv.build ? 'production': 'development';

plugins.push(new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
	'PLATFORM': JSON.stringify(PLATFORM)
}));

if(argv.build) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        mangle: true,
        compress: {
            warnings: false
        }
    }));
	
	plugins.push(new CopyWebpackPlugin([{from: 'src/client/resources', to: 'dist/' + PLATFORM + '/'}]));

    devtool = null;
    output = 'dist/' + PLATFORM + '/static/js/index.js';
    debug = false;
}
else {
    entry.push('webpack-dev-server/client?http://localhost:4000');
	plugins.push(new CopyWebpackPlugin([{from: 'src/client/resources', to: './'}]));
}

module.exports = {
    entry: entry,
    output: { filename: output },
    debug: debug,
    devtool: devtool,
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                query: {presets: ['react', 'es2015', 'stage-0']}
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                query: { presets: ['es2015', 'stage-0'] }
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.(html|htm)$/, loader: 'dom' }
        ],
        noParse: /.*[\/\\]bin[\/\\].+\.js/
    },
    plugins: plugins
};