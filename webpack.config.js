const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {

let entry = [
    'babel-polyfill',
    './src/client/index'
];

let plugins = [];

let devtool = 'eval-source-map';
let output = 'static/js/index.js';

let PLATFORM = env.platform || 'web';
let NODE_ENV = env.build ? 'production' : 'development';

let target = 'web';
if (PLATFORM === 'electron') target = 'electron-renderer';

plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'PLATFORM': JSON.stringify(PLATFORM)
}));

if (env.build) {
    let outputDir;

    if (PLATFORM === 'web') {
        outputDir = 'web/';
    }

    if (PLATFORM === 'electron') {
        outputDir = '../electron/www/';
    }

    plugins.push(new CopyWebpackPlugin({patterns: [{from: 'src/client/resources', to: outputDir}]}));

    devtool = false;
    output = outputDir + 'static/js/index.js';
}
else {
    plugins.push(new CopyWebpackPlugin({patterns: [{from: 'src/client/resources', to: './'}]}));
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
    module: {
        noParse: /.*[\/\\]bin[\/\\].+\.js/,
        rules: [
            {
                test: /.jsx?$/,
                include: [path.resolve(__dirname, 'src')],
                use: [{loader: 'babel-loader', options: {presets: ['@babel/preset-react', '@babel/preset-env']}}]
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                use: [{loader: 'babel-loader', options: {presets: ['@babel/preset-env']}}]
            }
        ]
    },
    optimization: {
        minimize: false
    },
    plugins: plugins,
    devServer: {host: '127.0.0.1', port: 4000}
};

if (target === 'electron-renderer') {
    config.resolve = {alias: {'platform': path.resolve(__dirname, './src/client/platform/electron')}};
} else {
    config.resolve = {
        alias: {'platform': path.resolve(__dirname, './src/client/platform/web')},
        // webpack 5 no longer polyfills node core modules
        fallback: {
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            timers: require.resolve('timers-browserify')
        }
    };
}

return config;

};