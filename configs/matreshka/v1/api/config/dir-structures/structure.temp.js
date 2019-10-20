const path = require('path');

let temp = '';

/* Builds prod structure */
exports.getMethods = function (tempDir) {
    temp = tempDir;
    return {
        getTempDir: getTempDir,
        getAotTempDir: getAotTempDir,
        getManifestTempDir: getManifestTempDir,
        getCachesTempDir: getCachesTempDir,
        getCachesLintTempDir: getCachesLintTempDir,
        getCachesVendorsTempDir: getCachesVendorsTempDir,
        getCachePolifylsModify: getCachePolifylsModify,
        getCacheVendorsModify: getCacheVendorsModify,
        getTestsTempDir: getTestsTempDir
    };
};

function getTempDir() {
    return temp;
}

function getAotTempDir() {
    return path.resolve(temp, 'aot');
}

function getManifestTempDir() {
    return path.resolve(temp, 'manifest');
}

function getCachesTempDir() {
    return path.resolve(temp, 'cache');
}

function getCachesLintTempDir() {
    return path.resolve(temp, 'lints');
}

function getCachesVendorsTempDir() {
    return path.resolve(getCachesTempDir(), 'vendors');
}

function getCachePolifylsModify() {
    return path.resolve(getCachesVendorsTempDir(), 'polifyls.cache.json');
}

function getCacheVendorsModify() {
    return path.resolve(getCachesVendorsTempDir(), 'vendors.cache.json');
}

function getTestsTempDir() {
    return path.resolve(temp, 'tests');
}
