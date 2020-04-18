const path = require('path');
const CONST = require('../../../../utils/constants');

let currDir = '';
let lints = '';
let src = '';
let temps = '';
let isAngular = '';

/* Builds prod structure */
exports.getMethods = function (currDirParam, lintsConf, srcConf, tempDirs, isAngularParam) {
    currDir = currDirParam;
    lints = lintsConf;
    src = srcConf;
    temps = tempDirs;
    isAngular = isAngularParam;
    
    return {
        getConfDir: getConfDir,
        isCssLint: isCssLint,
        isJsLint: isJsLint,
        isTsLint: isTsLint,
        getCss: getCss,
        getJs: getJs,
        getTs: getTs
    };
};

function getConfDir() {
    return path.resolve(currDir, 'configs', CONST.LINTS.DIR_NAME);
}

function getCss() {
    return {
        get files() {
            if (!isCssLint()) {
                return;
            }
            if (isAngular) {
                return [path.resolve(src.getSrcDir(), '**/*.css')];
            }
            return src.getCommonStyleFiles();
        },
        result: {},
        get cacheFile() {
            return path.resolve(temps.getCachesLintTempDir(), CONST.LINTS.FILE_NAMES.CSS + '.cache.json');
        },
        get configFile() {
            return path.resolve(getConfDir(), CONST.LINTS.FILE_NAMES.CSS + '.config.json');
        }
    };
}

function getJs() {
    return {
        get files() {
            if (isAngular || !isJsLint()) {
                return;
            }
            return [...src.scripts.getJsFiles(), `!${path.resolve(src.getSrcDir(), '**/*.spec.js')}`];
        },
        result: {},
        get cacheFile() {
            return path.resolve(temps.getCachesLintTempDir(), CONST.LINTS.FILE_NAMES.JS + '.cache.json');
        },
        get configFile() {
            return path.resolve(getConfDir(), CONST.LINTS.FILE_NAMES.JS + '.config.json');
        }
    };
}

function getTs() {
    return {
        get files() {
            if (!isAngular || !isTsLint()) {
                return;
            }
            if (isAngular) {
                return [path.resolve(src.getSrcDir(), '**/*.ts'), `!${path.resolve(src.getSrcDir(), '**/*.spec.ts')}`];
            }
            return [...src.scripts.getTsFiles(), `!${path.resolve(src.getSrcDir(), '**/*.spec.ts')}`];
        },
        result: {},
        get cacheFile() {
            return path.resolve(temps.getCachesLintTempDir(), CONST.LINTS.FILE_NAMES.TS + '.cache.json');
        },
        get configFile() {
            return path.resolve(getConfDir(), CONST.LINTS.FILE_NAMES.TS + '.config.json');
        }
    };
}

function isCssLint() {
    return lints.css;
}

function isJsLint() {
    return lints.js;
}

function isTsLint() {
    return lints.ts;
}




