const path = require('path');

let temps = '';
let outputs = '';
let scripts = '';

/* Builds prod structure */
exports.getMethods = function (tempDirs, outsNames, scriptsNames) {
    temps = tempDirs;
    outputs = outsNames;
    scripts = scriptsNames;
    return {
        getBuiltTestPolyfillsFiles: getBuiltTestPolyfillsFiles,
        getBuiltVendorFiles: getBuiltVendorFiles,
        getBuiltTestFiles: getBuiltTestFiles
    };
};


function getBuiltTestPolyfillsFiles() {
    return scripts.getTestPolifylsNames().map((polyfil) => {
        return path.resolve(temps.getCachesVendorsTempDir(), polyfil.replace('.ts', '.js'));
    });
}

function getBuiltVendorFiles() {
    return path.resolve(temps.getCachesVendorsTempDir(), outputs.getVendorsOutName());
}

function getBuiltTestFiles() {
    return path.resolve(temps.getTestsTempDir(), '*.spec.*');
}
