/**
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 30.07.2017 22:26
 */
const webpack4 = require('webpack');
const path = require('path');
const projectConf = require("../v1/api/matreshka");
const helpers = require('../utils/helpers.utils');

const ProgressPlugin = require('webpack/lib/ProgressPlugin');

module.exports = {
    mode: helpers.getMode(),
    output: {
        filename: '[name].js',
        library: ['provided', '[name]'],
        // Это нужно, что бы вебпак не ставил свой дефолтный путь dest для собранных файлов (это ломает копирование)
        // Это поведение появилось с 4 версии вебпака
        path: path.resolve(__dirname)
    },
    devtool: helpers.isDevelopment() ? 'source-map' : '',
    plugins: [
        new webpack4.NoEmitOnErrorsPlugin(),
        new webpack4.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)esm5/, projectConf.src.getSrcDir()),
        new webpack4.DllPlugin({
            path: path.resolve('manifest', '[name].manifest.json'),
            name: 'provided[\'[name]\']'
        }),
        new ProgressPlugin()
    ],
    resolve: {
        modules: [
            path.resolve(projectConf.getProjectRootDir, 'node_modules'),
        ],
        extensions: ['.ts', '.js']
    },
    stats: {
        colors: true,
        hash: false,
        timings: false,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        version: false,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        entrypoints: false,
        errors: true,
        errorDetails: true
    }
};

exports.logStatsInfoOptions = {
    colors: true,
    hash: true,
    timings: false,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true,
    version: true,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    warnings: false,
    errors: true,
    errorDetails: true
};

if (helpers.mode.isDebug()) {
    module.exports.stats = {
        colors: true,
        hash: false,
        timings: false,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        version: false,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        entrypoints: false,
        warnings: true,
        errors: true,
        errorDetails: true
    }
}

