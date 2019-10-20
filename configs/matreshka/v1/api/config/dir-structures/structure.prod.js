const path = require('path');

let currentDir = "";
let structure = {};

/* Builds prod structure */
exports.getMethods = function (currDir, struct) {
    currentDir = currDir;
    structure = struct;
    return {
        getDir: getDir,
        getHtmlDir: getHtmlDir,
        getImgDir: getImgDir,
        getFontsDir: getFontsDir,
        getStylesDir: getStylesDir,
        getScriptsDir: getScriptsDir,
        getResourcesDir: getResourcesDir,
        getScriptPublicPath: getScriptPublicPath
    };
};

function getScriptPublicPath() {
    return structure.scripts.replace('./', '/') + '/';
}

function getDir() {
    return path.resolve(currentDir, structure.dir);
}

function getHtmlDir() {
    return path.resolve(getDir(), structure.html);
}

function getImgDir() {
    return path.resolve(getDir(), structure.img);
}

function getFontsDir() {
    return path.resolve(getDir(), structure.fonts);
}

function getStylesDir() {
    return path.resolve(getDir(), structure.styles);
}

function getScriptsDir() {
    return path.resolve(getDir(), structure.scripts);
}

function getResourcesDir() {
    return path.resolve(getDir(), structure.resources);
}
