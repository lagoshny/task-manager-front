const path = require('path');
const _ = require('lodash');

let src = '';
let dev = '';
let isAngular = '';

exports.getMethods = function (srcConf, devConf, isAngularParam) {
    src = srcConf;
    dev = devConf;
    isAngular = isAngularParam;
    return {
        getDevBuildWatch: getDevBuildWatch,
        getHtmlWatch: getHtmlWatch,
        getImgWatch: getImgWatch,
        getFontsWatch: getFontsWatch,
        getResourcesWatch: getResourcesWatch,
        getTestsWatch: getTestsWatch,
        getPolifylsWatch: getPolifylsWatch,
        getVendorsWatch: getVendorsWatch,
        getStyleWatch: getStyleWatch,
        getJsWatch: getJsWatch
    };
};

function getDevBuildWatch() {
    return path.resolve(dev.getDir(), '**/*.*');
}

function getHtmlWatch() {
    return src.getHtmlFiles();
}

function getImgWatch() {
    return src.getImgFiles();
}

function getFontsWatch() {
    return src.getFontFiles();
}

function getResourcesWatch() {
    return src.getResourceFiles();
}

function getTestsWatch() {
    return src.scripts.getTestFiles();
}

function getPolifylsWatch() {
    if (!src.scripts.isPolifyls()) {
        return;
    }
    return [...src.scripts.getAllPolifyls().map(file => path.resolve(path.dirname(file), '**/*.{js,ts}'))];
}

function getVendorsWatch() {
    if (src.scripts.isTsVendors()) {
        return [...src.scripts.getTsVendors().map(file => path.resolve(path.dirname(file), '**/*.{js,ts}'))];
    }
    if (src.scripts.isJsVendors()) {
        return [...src.scripts.getJsVendors().map(file => path.resolve(path.dirname(file), '**/*.{js,ts}'))];
    }
}

function getStyleWatch() {
    if (_.isArray(src.getStyleFiles())) {
        const watchFiles = src.getStyleFiles().map((file) => path.resolve(path.dirname(file), '*.css'));
        if (src.isUseSass()) {
            watchFiles.push(...src.getStyleFiles().map((file) => path.resolve(path.dirname(file), '*.scss')));
        }
        return watchFiles;
    }

    const watchFiles = path.resolve(path.dirname(src.getStyleFiles()), '*.css');
    if (src.isUseSass()) {
        watchFiles.push(...path.resolve(path.dirname(src.getStyleFiles()), '*.scss'));
    }
    return watchFiles;
}

function getJsWatch() {
    if (isAngular || src.scripts.isModuleScript()) {
        return;
    }
    return src.scripts.getJsFiles();
}

function getFiles(files) {
    if (_.isArray(files)) {
        return files.map((file) => path.resolve(getSrcDir(), file));
    }
    return [path.resolve(getSrcDir(), files)];
}