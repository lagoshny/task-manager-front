/* Import all required modules */
const parser = require('./config/parser');
const manifestFiles = require('./config/dir-structures/structure.manifest');
const devStructure = require('./config/dir-structures/structure.dev');
const prodStructure = require('./config/dir-structures/structure.prod');
const srcStructure = require('./config/dir-structures/structure.src');
const tempStructure = require('./config/dir-structures/structure.temp');
const outputsProject = require('./config/dir-structures/structure.outputs');
const testsProject = require('./config/dir-structures/structure.tests');
const lintProject = require('./config/dir-structures/structure.lint');
const watchProject = require('./config/dir-structures/structure.watch');
const CONST = require('../../utils/constants');
const path = require('path');

let conf = parser.loadConfiguration();
exports.getProjectRootDir = parser.currDir;
exports.getMatreshkaDir = parser.matreshkaDir;
exports.dev = devStructure.getMethods(parser.currDir, conf.project);
exports.manifest = manifestFiles.getData(getTempDir());
exports.prod = prodStructure.getMethods(parser.currDir, conf.project.prodStruct);
exports.src = srcStructure.getMethods(parser.currDir, conf.project.src, isUseFrameworkByName('angular'));
exports.temps = tempStructure.getMethods(getTempDir());
exports.webpackConfig = path.resolve(parser.matreshkaDir, `builds/${CONST.WEBPACK.CONFIG_FILE_NAME}`);
exports.webpackAotConfig = path.resolve(parser.matreshkaDir, `builds/${CONST.WEBPACK.AOT_CONFIG_FILE_NAME}`);
exports.webpackTestConfig = path.resolve(parser.matreshkaDir, `builds/${CONST.WEBPACK.TEST_CONFIG_FILE_NAME}`);
exports.webpackDllConfig = path.resolve(parser.matreshkaDir, `builds/${CONST.WEBPACK.DLL_CONFIG_FILE_NAME}`);
exports.karmaConfig = path.resolve(parser.matreshkaDir, `builds/${CONST.KARMA_CONFING_FILE_NAME}`);
exports.outputs = outputsProject.getMethods(conf.project.outputs);
exports.test = testsProject.getMethods(exports.temps, exports.outputs, exports.src.scripts);
exports.lint = lintProject.getMethods(parser.currDir, conf.project.lints, exports.src, exports.temps, isUseFrameworkByName('angular'));
exports.watch = watchProject.getMethods(exports.src, exports.dev, isUseFrameworkByName('angular'));
exports.isUseFrameworkByName = isUseFrameworkByName;
exports.getFrameWorkConfigByName = getFrameWorkConfigByName;

function getTempDir() {
    return path.resolve(parser.currDir, conf.project.tempDir);
}


/* Frameworks */
const ANGULAR_FRAMEWORK = 'angular';

function isUseFrameworkByName(name) {
    if (!isUseFrameworks()) {
        return '';
    }
    return !!conf.frameworks[name];
}

return conf.project.outputs.styles;

function getFrameWorkConfigByName(name) {
    if (!isUseFrameworkByName(name)) {
        return {};
    }
    if (ANGULAR_FRAMEWORK === name) {
        return require('./config/frameworks/angular')(exports.src.getSrcDir(), conf.frameworks[ANGULAR_FRAMEWORK]);
    }
}

function isUseFrameworks() {
    return !!conf.frameworks;
}


