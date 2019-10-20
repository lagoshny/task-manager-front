/* Import all required modules */
const path = require('path');
const fs = require('fs');
const yamlParser = require('js-yaml');
const _ = require('lodash');
const CONSTANTS = require('../../../utils/constants');


/* Setup path to project's folders */
const currDir = process.env.PWD ? process.env.PWD : __dirname;
const matreshkaDir = path.resolve(currDir, 'configs', 'matreshka');
const defaultConfigFile = path.resolve(matreshkaDir, 'v1', 'api', 'config', CONSTANTS.DEFAULT_CONFIG);
let conf;
let defaultConf;

exports.loadConfiguration = function loadConfiguration() {
    checkExistsConfigs();
    conf = yamlParser.safeLoad(fs.readFileSync(path.resolve(currDir, CONSTANTS.CONFIG_FILE_NAME)));
    defaultConf = yamlParser.safeLoad(fs.readFileSync(defaultConfigFile));
    checkStructureConfig(conf);

    return conf;
};
exports.currDir = currDir;
exports.matreshkaDir = matreshkaDir;

function checkExistsConfigs() {
    if (!fs.existsSync(path.resolve(currDir, CONSTANTS.CONFIG_FILE_NAME))) {
        throw new Error('Файлы конфигурации не были обнаружены!');
    }
    if (!fs.existsSync(defaultConfigFile)) {
        throw new Error('Дефолтный файл конфигурации не были обнаружен!');
    }
}

function checkStructureConfig(conf) {
    if (!conf) {
        throw new Error('Файл конфигурации не был загружен, проверьте правильность формата yml файла!');
    }
    checkApiVersion(conf.version);
    checkProjectData(conf.project);
    if (conf.frameworks) {
        checkFrameworksData(conf.frameworks);
    }
}

function checkApiVersion(passedVersion) {
    if (!passedVersion || passedVersion !== CONSTANTS.API.V1) {
        throw Error('Файл конфигурации содежрит неверную версию API!');
    }
}

function checkProjectData(project) {
    if (!project) {
        throw Error('Файл конфигурации не содежрит обязательную секцию project');
    }

    checkProjectSrc(project.src);

    if (!project.devStruct) {
        project.devStruct = defaultConf.project.devStruct;
    } else {
        checkProjectDevStruct(project.devStruct);
    }

    if (!project.prodStruct) {
        project.prodStruct = defaultConf.project.prodStruct;
    } else {
        checkProjectProdStruct(project.prodStruct);
    }

    if (!project.tempDir) {
        throw Error('Файл конфигурации не содежрит обязательную секцию project.tempDir!');
    }

    if (!project.outputs) {
        project.outputs = defaultConf.project.outputs;
    } else {
        checkProjectOutputs(project.outputs);
    }

    if (!project.lints) {
        project.lints = defaultConf.project.lints;
    } else {
        checkProjectLints(project.lints);
    }

}

function checkProjectSrc(src) {
    if (!src) {
        throw Error('Файл конфигурации не содежрит обязательную секцию project.src');
    }
    if (!src.dir) {
        throw Error('Файл конфигурации не содежрит обязательную секцию project.src.dir');
    }
    if (!src.entries) {
        src.entries = defaultConf.entries;
    } else {
        checkEntriesData(src.entries);
    }
}

function checkEntriesData(entries) {
    if (!entries) {
        entries = defaultConf.project.src.entries;
    }
    if (!entries.html) {
        entries.html = defaultConf.project.src.entries.html;
    }
    if (!entries.img) {
        entries.img = defaultConf.project.src.entries.img;
    }
    if (!entries.fonts) {
        entries.fonts = defaultConf.project.src.entries.fonts;
    }
    if (!entries.styles) {
        entries.styles = defaultConf.project.src.entries.styles;
    }

    checkEntriesScriptsData(entries.scripts);

    if (!entries.resources) {
        entries.resources = defaultConf.project.src.entries.resources;
    }
}

function checkEntriesScriptsData(scripts) {
    if (!scripts) {
        scripts = defaultConf.project.src.entries.scripts;
    } else {
        if (_.isUndefined(scripts.modules)) {
            scripts.modules = defaultConf.project.src.entries.scripts.modules;
        }
        if (!scripts.js && (!scripts.ts || !scripts.ts.files)) {
            scripts.js = defaultConf.project.src.entries.scripts.js;
        }
        if (!scripts.js.files && (!scripts.ts || !scripts.ts.files) ) {
            scripts.js.files = defaultConf.project.src.entries.scripts.js.files;
        }
        if (!scripts.test) {
            scripts.test = defaultConf.project.src.entries.scripts.test;
        }
        if (!scripts.test.specs) {
            scripts.test.specs = defaultConf.project.src.entries.scripts.test.specs;
        }
        if (_.isUndefined(scripts.test.tdd)) {
            scripts.test.tdd = defaultConf.project.src.entries.scripts.test.tdd;
        }
        if (_.isUndefined(scripts.test.singleTdd)) {
            scripts.test.singleTdd = defaultConf.project.src.entries.scripts.test.singleTdd;
        }
    }
}

function checkProjectDevStruct(struct) {
    if (!struct) {
        struct = defaultConf.project.devStruct;
    }
    if (!struct.dir) {
        struct.dir = defaultConf.project.devStruct.dir;
    }
    if (!struct.html) {
        struct.html = defaultConf.project.devStruct.html;
    }
    if (!struct.img) {
        struct.img = defaultConf.project.devStruct.img;
    }
    if (!struct.fonts) {
        struct.fonts = defaultConf.project.devStruct.fonts;
    }
    if (!struct.styles) {
        struct.styles = defaultConf.project.devStruct.styles;
    }
    if (!struct.scripts) {
        struct.scripts = defaultConf.project.devStruct.scripts;
    }
    if (!struct.resources) {
        struct.resources = defaultConf.project.devStruct.resources;
    }
}

function checkProjectProdStruct(struct) {
    if (!struct) {
        struct = defaultConf.project.prodStruct;
    }
    if (!struct.dir) {
        struct.dir = defaultConf.project.prodStruct.dir;
    }
    if (!struct.html) {
        struct.html = defaultConf.project.prodStruct.html;
    }
    if (!struct.img) {
        struct.img = defaultConf.project.prodStruct.img;
    }
    if (!struct.fonts) {
        struct.fonts = defaultConf.project.prodStruct.fonts;
    }
    if (!struct.styles) {
        struct.styles = defaultConf.project.prodStruct.styles;
    }
    if (!struct.scripts) {
        struct.scripts = defaultConf.project.prodStruct.scripts;
    }
    if (!struct.resources) {
        struct.resources = defaultConf.project.prodStruct.resources;
    }
}

function checkProjectOutputs(outputs) {
    if (!outputs.scripts) {
        outputs.scripts = defaultConf.project.outputs.scripts;
    }
    if (!outputs.scripts.files) {
        outputs.scripts.files = defaultConf.project.outputs.scripts.files;
    }
    if (!outputs.scripts.vendors) {
        outputs.scripts.vendors = defaultConf.project.outputs.scripts.vendors;
    }
    if (!outputs.polyfills) {
        outputs.polyfills = defaultConf.project.outputs.polyfills;
    }
    if (!outputs.styles) {
        outputs.styles = defaultConf.project.outputs.styles;
    }
}

function checkProjectLints(lints) {
    if (_.isUndefined(lints.css)) {
        lints.css = defaultConf.project.lints.css;
    }
    if (_.isUndefined(lints.js)) {
        lints.js = defaultConf.project.lints.js;
    }
    if (_.isUndefined(lints.ts)) {
        lints.ts = defaultConf.project.lints.ts;
    }
}

/* Frameworks */
function checkFrameworksData(frameworks) {
    if (frameworks.angular) {
        checkAngularFrameworkData(frameworks.angular);
    }
}

function checkAngularFrameworkData(angular) {
    if (!angular.configs) {
        angular.configs = defaultConf.angular.configs;
    } else {
        checkAngularConfig(angular.configs);
    }

    if (!angular.compilation) {
        angular.compilation = {};
    }
    checkAngularCompilation(angular.compilation);
}

function checkAngularConfig(configs) {
    if (_.isUndefined(configs.inlineStyles)) {
        configs.inlineStyles = defaultConf.frameworks.angular.configs.inlineStyles;
    }
    if (_.isUndefined(configs.inlineTemplate)) {
        configs.inlineTemplate = defaultConf.frameworks.angular.configs.inlineTemplate;
    }
    if (_.isUndefined(configs.inlineTemplate)) {
        configs.inlineTemplate = defaultConf.frameworks.angular.configs.inlineTemplate;
    }
    if (_.isUndefined(configs.lazyRoute)) {
        configs.lazyRoute = defaultConf.frameworks.angular.configs.lazyRoute;
    }
}

function checkAngularCompilation(compilation) {
    if (!compilation.main) {
        compilation.main = defaultConf.angular.compilation.main;
    }
}