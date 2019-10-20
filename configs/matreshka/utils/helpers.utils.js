/**
 * Some useful methods, which helps improve configuration code
 *
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 27.07.2017 22:59
 */

'use strict';

const $ = require('gulp-load-plugins')();
const del = require('del');

const path = require('path');
const CONST = require('./constants');

const projectConf = require('../v1/api/matreshka');

//For install ENV in Windows console, use command: set NODE_ENV=prod && gulp task_name or separate.
const NODE_ENV = process.env.NODE_ENV || 'dev';
const debug = process.env.npm_config_info;


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
    errors: true,
    warnings: true,
    errorDetails: true
};

exports.logStatsOnlyErrorOptions = {
    colors: true,
    hash: false,
    timings: false,
    assets: false,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
    version: false,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    entrypoints: false,
    warnings: false,
    errors: true,
    errorDetails: true
};

exports.logStatsTestDefaultOptions = {
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
    errors: false,
    warnings: false,
    errorDetails: false
};

exports.isDevelopment = function isDevelopment() {
    return NODE_ENV === 'dev';
};

exports.isProduction = function isProduction() {
    return NODE_ENV === 'prod';
};


exports.getMode = function getMode() {
    if (exports.isProduction()) {
        return 'production';
    }
    if (exports.isDevelopment()) {
        return 'development';
    }
    return 'none';
};

exports.mode = {
    isDebug: function () {
        return debug;
    }
};

exports.createFolder = function (folderName) {
    const mkdirp = require('mkdirp');
    if (!folderName) {
        return;
    }
    mkdirp.sync(folderName);
};

exports.constants = {
    testSuffix: CONST.TEST_SUFFIX,
    testSuffixPattern: new RegExp(`.${CONST.TEST_SUFFIX}.`)
};


exports.buildCaches = {
    html: {
        name: CONST.CACHE_NAME.HTML
    },
    fonts: {
        name: CONST.CACHE_NAME.FONTS
    },
    img: {
        name: CONST.CACHE_NAME.IMG
    },
    resources: {
        name: CONST.CACHE_NAME.RESOURCES
    },
    scripts: {
        name: CONST.CACHE_NAME.JS
    },
    test: {
        name: CONST.CACHE_NAME.TEST
    },
    polifyls: {
        dir: projectConf.temps.getCachesVendorsTempDir(),
        name: CONST.CACHE_NAME.POLIFYLS,
        title: 'Polifyls',
        cacheLastModify: projectConf.temps.getCachePolifylsModify(),
        lastModify: {},
        needRebuild: true,
        watch: false
    },
    vendors: {
        dir: projectConf.temps.getCachesVendorsTempDir(),
        name: CONST.CACHE_NAME.VENDORS,
        title: 'Vendors',
        cacheLastModify: projectConf.temps.getCacheVendorsModify(),
        lastModify: {},
        needRebuild: true,
        watch: false
    }
};

exports.prodNames = {
    vendors: {
        get name() {
            return 'vendors.js';
        },
        get hashName() {
            return 'vendors-*.js';
        },
        get hashPath() {
            return path.resolve(projectConf.prod.getScriptsDir(), this.hashName);
        }
    },
    polifyls: {
        get name() {
            return 'polyfills.js';
        },
        get hashName() {
            return 'polyfills-*.js';
        },
        get hashPath() {
            return path.resolve(projectConf.prod.getScriptsDir(), this.hashName);
        }
    },
    scripts: {
        get name() {
            return 'main.js';
        },
        get hashName() {
            return 'main-*.js';
        },
        get hashPath() {
            return path.resolve(projectConf.prod.getScriptsDir(), this.hashName);
        }
    },
    styles: {
        get name() {
            return 'styles.css';
        },
        get hashName() {
            return 'styles-*.css';
        },
        get hashPath() {
            return path.resolve(projectConf.prod.getStylesDir(), this.hashName);
        }
    }
};

exports.isExistPreviousCheck = function (obj) {
    return Object.keys(obj).length === 0;
};

exports.lintErrorReporter = function (fileType) {
    let msg;
    if (fileType === 'css') {
        msg = '\nUse the command \'npm run css:lint\' for get more information about warnings in your CSS files';
    }
    if (fileType === 'js') {
        msg = '\nUse the command \'npm run js:lint\' for get more information about warnings in your JS files';
    }
    if (fileType === 'ts') {
        msg = '\nUse the command \'npm run ts:lint\' for get more information about warnings in your TS files';
    }
    return function (err) {
        $.notify({
            title: 'You have error with ' + fileType + ' file(s)',
            message: err.message + msg
        }).write(err);
        del(projectConf.prod.getDir(), {force: true});
        process.exit(1);
    };
};

exports.deleteFilesFromCache = function (cacheName, isRemember) {
    return function (fileName) {
        if (isRemember && cacheName) {
            $.remember.forget(cacheName, path.resolve(fileName));
        }
        let buildFileName = fileName.replace(projectConf.src.getSrcDir(), projectConf.dev.getDir());

        if (exports.buildCaches.polifyls.lastModify[fileName]) {
            buildFileName = fileName.replace(projectConf.src.scripts.getPolifylsDir(), projectConf.temps.getCachesVendorsTempDir());
            delete exports.buildCaches.polifyls.lastModify[fileName];
        }
        if (exports.buildCaches.vendors.lastModify[fileName]) {
            buildFileName = fileName.replace(projectConf.src.scripts.getVendorsDir(), projectConf.temps.getCachesVendorsTempDir());
            delete exports.buildCaches.vendors.lastModify[fileName];
        }
        del.sync(buildFileName, {force: true});
        //Так же по оригинальному пути, удаляем файл из кеша
        if (cacheName && $.cached.caches[cacheName]) {
            delete $.cached.caches[cacheName][path.resolve(fileName)];
        }
    };
};