/* Angular */
const path = require('path');

let angularConf;
let srcDir;
module.exports = function (srcDirParam, angularConfParam) {
    srcDir = srcDirParam;
    angularConf = angularConfParam;
    return {
        isAngularInlineStyles: isAngularInlineStyles,
        isAngularInlineTemplate: isAngularInlineTemplate,
        isAngularRedirectToIndex: isAngularRedirectToIndex,
        isAngularLazyRoute: isAngularLazyRoute,
        getAngularMain: getAngularMain,
        isAotCompilation: isAotCompilation,
        isTestCompilation: isTestCompilation,
        getAngularMainAot: getAngularMainAot,
        getAngularMainTest: getAngularMainTest,
        getAngularTestFiles: getAngularTestFiles,
        getAngularMainTestName: getAngularMainTestName
    };
};

function isAngularInlineStyles() {
   return angularConf.configs.inlineStyles;
}

function isAngularInlineTemplate() {
    return angularConf.configs.inlineTemplate;
}

function isAngularRedirectToIndex() {
    return angularConf.configs.redirectToIndex;
}

function isAngularLazyRoute() {
    return angularConf.configs.lazyRoute;
}

function getAngularMain() {
    return path.resolve(srcDir, angularConf.compilation.main);
}

function getAngularMainAot() {
    if (isAotCompilation()) {
        return path.resolve(srcDir, angularConf.compilation.mainAot);
    }
    return '';
}

function getAngularMainTestName() {
    if (isTestCompilation()) {
        return angularConf.compilation.mainTest;
    }
    return '';
}

function getAngularMainTest() {
    if (isTestCompilation()) {
        return path.resolve(srcDir, angularConf.compilation.mainTest);
    }
    return '';
}

function isAotCompilation() {
    return !!angularConf.compilation.mainAot;
}

function isTestCompilation() {
    return !!angularConf.compilation.mainTest;
}

function getAngularTestFiles() {
    if (!isTestCompilation() || !angularConf.tests) {
        return '';
    }
    return angularConf.tests;
}