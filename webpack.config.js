const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('optimist').argv;

let entry = [
    'babel-polyfill',
    './src/client/index'
];

let plugins = [];

let devtool = 'eval-source-map';
let output = 'static/js/index.js';
let debug = true;

let PLATFORM = argv.platform || 'web';
let NODE_ENV = argv.build ? 'production': 'development';

let target = 'web';
if(PLATFORM === 'electron') target = 'electron-renderer';

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

let config = {
    entry: entry,
    output: { filename: output },
    debug: debug,
    devtool: devtool,
    target: target,
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

if(target === 'electron-renderer') {
    config.resolve = {alias: {'provider': path.resolve(__dirname, './src/client/provider/electron')}};
}
else {
    config.resolve = {alias: {'provider': path.resolve(__dirname, './src/client/provider/web')}};
}

module.exports = config;