const path = require('path');
const _ = require('lodash');
const scriptsStruct = require('./structure.src.script');

let currentDir = "";
let src = {};

/* Src Structure */
exports.getMethods = function (currDir, srcConf, isAngularParam) {
    currentDir = currDir;
    src = srcConf;
    return {
        getSrcDir: getSrcDir,
        getHtmlFiles: getHtmlFiles,
        getImgFiles: getImgFiles,
        getFontFiles: getFontFiles,
        getStyleFiles: getStyleFiles,
        isUseSass: isUseSass,
        getResourceFiles: getResourceFiles,
        scripts: scriptsStruct.getMethods(getSrcDir(), src.entries.scripts, isAngularParam)
    };
};

/* Project dirs */
function getSrcDir() {
    return path.resolve(currentDir, src.dir);
}

/* Entries */
function getHtmlFiles() {
    return getFiles(src.entries.html);
}

function getImgFiles() {
    return getFiles(src.entries.img);
}

function getFontFiles() {
    return getFiles(src.entries.fonts);
}

function getStyleFiles() {
    return getFiles(src.entries.styles.files);
}

function isUseSass() {
    return src.entries.styles.useSass;
}

function getResourceFiles() {
    return getFiles(src.entries.resources);
}

function getFiles(files) {
    if (_.isArray(files)) {
        return files.map((file) => path.resolve(getSrcDir(), file));
    }
    return [path.resolve(getSrcDir(), files)];
}