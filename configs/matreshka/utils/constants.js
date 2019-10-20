exports.CONFIG_FILE_NAME = "matreshka.yml";
exports.DEFAULT_CONFIG = "default.yml";
exports.API = {
    V1: 1
};
/* Setup path and name for manifests files */
exports.MANIFEST = {
    DIR_NAME: 'manifest',
    FILE_NAMES: {
        CSS: 'css',
        JS: 'js',
        IMG: 'img',
        PROVIDED: 'provided'
    }
};

/* Setup path and name for lints configuration and cache */
exports.LINTS = {
    DIR_NAME: 'lints',
    FILE_NAMES: {
        CSS: 'csslint',
        JS: 'eslint',
        TS: 'tslint'
    }
};

exports.WEBPACK = {
    CONFIG_FILE_NAME: 'webpack.config.js',
    AOT_CONFIG_FILE_NAME: 'webpack.aot.config.js',
    DLL_CONFIG_FILE_NAME: 'webpack.dll.config.js',
    TEST_CONFIG_FILE_NAME: 'webpack.test.config.js'
};

exports.KARMA_CONFING_FILE_NAME = 'karma.conf.js';


exports.CACHE_NAME = {
    HTML: 'html',
    IMG: 'images',
    FONTS: 'fonts',
    CSS: 'css',
    JS: 'js',
    POLIFYLS: 'polyfills',
    VENDORS: 'vendors',
    TS: 'ts',
    TEST: 'test',
    RESOURCES: 'resources'
};

exports.TEST_SUFFIX = 'test';