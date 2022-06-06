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
let NODE_ENV = argv.build ? 'production' : 'development';

let target = 'web';
if (PLATFORM === 'electron') target = 'electron-renderer';

plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'PLATFORM': JSON.stringify(PLATFORM)
}));

if (argv.build) {
    let outputDir;

    if (PLATFORM === 'web') {
        outputDir = 'web/';
    }

    if (PLATFORM === 'electron') {
        outputDir = '../electron/www/';
    }

    plugins.push(new CopyWebpackPlugin({ patterns: [{ from: 'src/client/resources', to: outputDir }] }));

    devtool = false;
    output = outputDir + 'static/js/index.js';
    debug = false;
}
else {
    entry.push('webpack-dev-server/client?http://localhost:4000');
    plugins.push(new CopyWebpackPlugin({ patterns: [{ from: 'src/client/resources', to: './' }] }));
}

let config = {
    entry: entry,
    output: {
        path: __dirname + "/dist",
        filename: output
    },
    devtool: devtool,
    target: target,
    mode: NODE_ENV,
    resolve: {
        modules: ['node_modules'],
        fallback: {
            "buffer": false,
            "stream": require.resolve('stream-browserify'),
            "timers": require.resolve('timers-browserify'),
        },
    },
    module: {
        noParse: /.*[\/\\]bin[\/\\].+\.js/,
        rules: [
            {
                test: /.jsx?$/,
                include: [path.resolve(__dirname, 'src')],
                use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-react', '@babel/preset-env'] } }]
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }]
            },
            {
                test: /\.(html|htm)$/,
                use: [{ loader: 'dom' }]
            }
        ]
    },
    optimization: {
        minimize: false
    },
    plugins: plugins
};

if (target === 'electron-renderer') {
    config.resolve = { alias: { 'platform': path.resolve(__dirname, './src/client/platform/electron') } };
} else {
    config.resolve = { alias: { 'platform': path.resolve(__dirname, './src/client/platform/web') } };
}

module.exports = config;