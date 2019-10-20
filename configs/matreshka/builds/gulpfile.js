/**
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 08.06.2017 21:42
 */
'use strict';

const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');
const path = require('path');

const CONST = require('../utils/constants');
const projectConf = require('../v1/api/matreshka');

const helpers = require('../utils/helpers.utils');

const statics = require('./tasks/static.task');
const css = require('./tasks/css.task');
const scripts = require('./tasks/scripts.task');
const testTasks = require('./tasks/test.task');

const tasksConf = {
    buildStaticConfig: {
        html: {
            src: projectConf.src.getHtmlFiles(),
            devDst: projectConf.dev.getHtmlDir(),
            prodDst: projectConf.prod.getHtmlDir(),
            cache: helpers.buildCaches.html,
            manifest: projectConf.manifest
        },
        fonts: {
            src: projectConf.src.getFontFiles(),
            devDst: projectConf.dev.getFontsDir(),
            prodDst: projectConf.prod.getFontsDir(),
            cache: helpers.buildCaches.fonts
        },
        images: {
            src: projectConf.src.getImgFiles(),
            devDst: projectConf.dev.getImgDir(),
            prodDst: projectConf.prod.getImgDir(),
            cache: helpers.buildCaches.img,
            manifest: projectConf.manifest
        },
        resources: {
            src: projectConf.src.getResourceFiles(),
            devDst: projectConf.dev.getResourcesDir(),
            prodDst: projectConf.prod.getResourcesDir(),
            cache: helpers.buildCaches.resources
        }
    },
    cssBuildConfig: {
        src: projectConf.src.getStyleFiles(),
        out: projectConf.outputs.getStylesOutName(),
        devDst: projectConf.dev.getStylesDir(),
        prodDst: projectConf.prod.getStylesDir(),
        manifest: projectConf.manifest
    },
    angularBuildConfigs: {
        src: [
            ...projectConf.src.scripts.getPolifyls(),
            projectConf.getFrameWorkConfigByName('angular').getAngularMain()
        ],
        scriptsConf: projectConf.src.scripts,
        scriptsOut: projectConf.outputs.getScriptsOutName(),
        polyfillsOut: projectConf.outputs.getScriptsOutName(),
        cache: helpers.buildCaches.scripts,
        temps: projectConf.temps,
        devDst: projectConf.dev.getScriptsDir(),
        prodDst: projectConf.prod.getScriptsDir(),
        wbpConf: projectConf.webpackConfig,
        manifest: projectConf.manifest
    },
    jsBuildConfigs: {
        src: [
            // В DEV режиме для полифилов будет использован КЕШ либ
            ...projectConf.src.scripts.getPolifyls(),
            ...projectConf.src.scripts.getTsFiles(),
            ...projectConf.src.scripts.getJsFiles()
        ],
        scriptsConf: projectConf.src.scripts,
        scriptsOut: projectConf.outputs.getScriptsOutName(),
        polyfillsOut: projectConf.outputs.getPolyfillsOutName(),
        cache: helpers.buildCaches.scripts,
        temps: projectConf.temps,
        devDst: projectConf.dev.getScriptsDir(),
        prodDst: projectConf.prod.getScriptsDir(),
        wbpConf: projectConf.webpackConfig,
        manifest: projectConf.manifest
    },
    angularAotBuildConfigs: {
        src: [
            // В DEV режиме для полифилов будет использован КЕШ либ
            ...projectConf.src.scripts.getPolifyls(),
            projectConf.getFrameWorkConfigByName('angular').getAngularMainAot()
        ].filter((entry) => /[^undefined]\S/.test(entry)),
        scriptsConf: projectConf.src.scripts,
        scriptsOut: projectConf.outputs.getScriptsOutName(),
        polyfillsOut: projectConf.outputs.getScriptsOutName(),
        cache: helpers.buildCaches.scripts,
        devDst: projectConf.dev.getScriptsDir(),
        prodDst: projectConf.prod.getScriptsDir(),
        wbpConf: projectConf.webpackAotConfig,
        manifest: projectConf.manifest
    },
    jsTestBuildConfigs: {
        testFiles: projectConf.src.scripts.getTestFiles(),
        src: [
            // В DEV режиме для полифилов будет использован КЕШ либ
            ...projectConf.src.scripts.getTestPolifyls(),
            ...projectConf.src.scripts.getTestFiles()].filter((entry) => /[^undefined]\S/.test(entry)),
        scriptsConf: projectConf.src.scripts,
        testCacheDir: projectConf.temps.getTestsTempDir(),
        cache: helpers.buildCaches.test,
        devDst: projectConf.temps.getCachesTempDir(),
        wbpConf: projectConf.webpackTestConfig,
        manifest: projectConf.manifest
    },
    angularTestBuildConfigs: {
        testFiles: projectConf.src.scripts.getTestFiles(),
        src: [
            // В DEV режиме для полифилов будет использован КЕШ либ
            ...projectConf.src.scripts.getTestPolifyls(),
            projectConf.getFrameWorkConfigByName('angular').getAngularMainTest(),
            ...projectConf.src.scripts.getTestFiles()].filter((entry) => /[^undefined]\S/.test(entry)),
        testCacheDir: projectConf.temps.getTestsTempDir(),
        scriptsConf: projectConf.src.scripts,
        cache: helpers.buildCaches.test,
        devDst: projectConf.temps.getTempDir(),
        wbpConf: projectConf.webpackTestConfig,
        manifest: projectConf.manifest
    },
    jsCopyVendors: {
        cache: projectConf.temps.getCachesVendorsTempDir(),
        devDst: projectConf.dev.getScriptsDir(),
        prodDst: projectConf.prod.getScriptsDir()
    },
    /**
     * Собирает специальный файл для полифила используя DLL плагин, что бы собрать либу один раз, и все вызовы
     * либы заменить на вызов уже собранной либы, т.о. мы кешируем нашу сборку либы (ссылки на кешированную либу
     * заменяются во время во время сборки JS файлов, когда webpack видет использование поливила в JS файле, то он заменяет
     * ссылку на уже собранную либу. (Данный кеш нужен только для DEV режима, в PROD режиме это будет только лишний файл
     * поэтому в прод режиме webpack не должен использовать этот кеш, а должен напрямую импортить полифилы в main.js
     */
    jsPolifylsConfigs: {
        handle: projectConf.src.scripts.isPolifyls() && helpers.isDevelopment(),
        src: helpers.isDevelopment()
            ? [...projectConf.src.scripts.getPolifyls(), ...projectConf.src.scripts.getTestPolifyls()].filter((entry) => /[^undefined]\S/.test(entry))
            : [...projectConf.src.scripts.getPolifyls()].filter((entry) => /[^undefined]\S/.test(entry)),

        filesDir: projectConf.src.scripts.getPolifylsDir(),
        handleModules: projectConf.src.scripts.isModuleScript(),
        out: projectConf.outputs.getPolyfillsOutName(),
        dst: projectConf.prod.getScriptsDir(),
        cache: helpers.buildCaches.polifyls,
        wbpLibConf: projectConf.webpackDllConfig,
        prodName: helpers.prodNames.polifyls.name
    },
    /**
     * Собирает специальный файл для вендор либ используя DLL плагин, что бы собрать либу один раз, и все вызовы
     * либы заменить на вызов уже собранной либы, т.о. мы кешируем нашу сборку либы (ссылки на кешированную либу
     * заменяются во время во время сборки JS файлов, когда webpack видет использование либы в JS файле, то он заменяет
     * ссылку на уже собранную либу. (Данный кеш нужен только для DEV режима, в PROD режиме это будет только лишний файл
     * поэтому в прод режиме webpack не должен использовать этот кеш, а должен напрямую импортить либы в main.js
     */
    jsVendorsConfigs: {
        handle: !helpers.isProduction(),
        src: [
            ...projectConf.src.scripts.getJsVendors(),
            ...projectConf.src.scripts.getTsVendors()
        ].filter((entry) => /[^undefined]\S/.test(entry)),
        filesDir: projectConf.src.scripts.getVendorsDir(),
        dst: projectConf.prod.getScriptsDir(),
        out: projectConf.outputs.getVendorsOutName(),
        handleModules: projectConf.src.scripts.isModuleScript(),
        cache: helpers.buildCaches.vendors,
        wbpLibConf: projectConf.webpackDllConfig,
        prodName: helpers.prodNames.vendors.name
    },
    testAngularConfig: {
        src: [
            ...projectConf.test.getBuiltTestPolyfillsFiles(),
            projectConf.test.getBuiltVendorFiles(),
            path.resolve(projectConf.temps.getTestsTempDir(),
                projectConf.getFrameWorkConfigByName('angular')
                    .getAngularMainTestName()
                    .replace('.ts', '.js')),
            projectConf.test.getBuiltTestFiles()
        ].filter((entry) => /[^undefined]\S/.test(entry)),
        config: projectConf.karmaConfig,
        handle: projectConf.src.scripts.isTest(),
        wbpConf: projectConf.webpackTestConfig
    },
    testConfigs: {
        src: [
            ...projectConf.test.getBuiltTestPolyfillsFiles(),
            projectConf.test.getBuiltVendorFiles(),
            projectConf.test.getBuiltTestFiles()
        ].filter((entry) => /[^undefined]\S/.test(entry)),
        config: projectConf.karmaConfig,
        handle: projectConf.src.scripts.isTest(),
        wbpConf: projectConf.webpackTestConfig
    },
    cssLintConfigs: {
        lint: projectConf.lint.getCss(),
        cache: projectConf.temps.getCachesLintTempDir()
    },
    jsLintConfigs: {
        lint: projectConf.lint.getJs(),
        cache: projectConf.temps.getCachesLintTempDir()
    },
    tsLintConfigs: {
        lint: projectConf.lint.getTs(),
        cache: projectConf.temps.getCachesLintTempDir()
    }
};

function clean(folder, file) {
    return function clean() {
        let deleteFolder = process.env.npm_config_cl || folder;
        if (deleteFolder === 'builds') {
            return del([projectConf.dev.getDir(), projectConf.prod.getDir(), projectConf.temps.getTempDir()], {force: true});
        }
        if (deleteFolder === 'cache') {
            return del(projectConf.temps.getCachesTempDir(), {force: true});
        }
        if (deleteFolder === 'tmp') {
            return del(projectConf.temps.getTempDir(), {force: true});
        }
        if (deleteFolder === 'tmpTest') {
            return del(projectConf.temps.getTestsTempDir(), {force: true});
        }
        if (deleteFolder === 'tests') {
            del(file.replace(path.dirname(file), projectConf.temps.getTestsTempDir()).replace('.spec.ts', '.js'), {force: true});
            return del(file.replace(path.dirname(file), projectConf.temps.getTestsTempDir()).replace('.ts', '.js'), {force: true});
        }
        return helpers.isProduction()
            ? del([projectConf.dev.getDir(), projectConf.prod.getDir(), projectConf.temps.getTempDir()], {force: true})
            : del([projectConf.dev.getDir(), projectConf.temps.getTestsTempDir()], {force: true});
    };
}

gulp.task('clean', clean());

gulp.task('clean:aot', function () {
    del(projectConf.temps.getAotTempDir(), {force: true});
    del(projectConf.temps.getCachesVendorsTempDir(), {force: true});
    return del(projectConf.prod.getDir(), {force: true});
});

gulp.task('statics', gulp.series(
    statics.buildFonts(tasksConf.buildStaticConfig.fonts),
    statics.buildResources(tasksConf.buildStaticConfig.resources)
    )
);


gulp.task('testWatch', function (done) {
    if (projectConf.src.scripts.isSingleTdd()) {
        gulp.watch(projectConf.test.getBuiltTestFiles()).on('change', (file) => {
            testTasks.testRun({
                src: [
                    ...projectConf.test.getBuiltTestPolyfillsFiles(),
                    projectConf.test.getBuiltVendorFiles(),
                    path.resolve(projectConf.temps.getTestsTempDir(),
                        projectConf.getFrameWorkConfigByName('angular')
                            .getAngularMainTestName()
                            .replace('.ts', '.js')),
                    file
                ].filter((entry) => /[^undefined]\S/.test(entry)),
                config: projectConf.karmaConfig,
                handle: projectConf.src.scripts.isTest()
            })(done);
        });
    }
    if (projectConf.src.scripts.isTdd() || projectConf.src.scripts.isSingleTdd()) {
        gulp.watch(projectConf.watch.getTestsWatch()).on('unlink', (file) => clean('tests', file)());
    }
    done();
});
gulp.task('buildPolifyls', scripts.providedBuild(tasksConf.jsPolifylsConfigs));
gulp.task('buildVendors', scripts.providedBuild(tasksConf.jsVendorsConfigs));
gulp.task('test', gulp.series(
    projectConf.getFrameWorkConfigByName('angular')
        ? scripts.jsTestBuild(tasksConf.angularTestBuildConfigs)
        : scripts.jsTestBuild(tasksConf.jsTestBuildConfigs),
    projectConf.getFrameWorkConfigByName('angular')
        ? testTasks.testRun(tasksConf.testAngularConfig)
        : testTasks.testRun(tasksConf.testConfigs),
    'testWatch'
    )
);
gulp.task('js', gulp.parallel(
    scripts.jsLint(tasksConf.jsLintConfigs),
    scripts.tsLint(tasksConf.tsLintConfigs),
    gulp.series(
        'buildPolifyls',
        'buildVendors',
        scripts.copyVendors(tasksConf.jsCopyVendors),
        scripts.jsBuild(projectConf.getFrameWorkConfigByName('angular') ? tasksConf.angularBuildConfigs : tasksConf.jsBuildConfigs)
    ))
);

gulp.task('aot', gulp.parallel(
    scripts.jsLint(tasksConf.jsLintConfigs),
    scripts.tsLint(tasksConf.tsLintConfigs),
    gulp.series(
        scripts.jsBuild(tasksConf.angularAotBuildConfigs)
    ))
);

gulp.task('css', gulp.series(
    css.cssLint(tasksConf.cssLintConfigs),
    css.cssBuild(tasksConf.cssBuildConfig))
);

gulp.task('css:linting', gulp.series(clean('tmp'), css.cssLint(tasksConf.cssLintConfigs)));
gulp.task('js:linting', gulp.series(clean('tmp'), scripts.jsLint(tasksConf.jsLintConfigs)));
gulp.task('ts:linting', gulp.series(clean('tmp'), scripts.tsLint(tasksConf.tsLintConfigs)));

gulp.task('clean:lintsCache', function (callback) {
    del(projectConf.temps.getCachesLintTempDir(), {force: true});
    callback();
});


// gulp.task('testWatch', function () {
//     helpers.buildCaches.polifyls.watch = true;
//     gulp.watch(projectConf.watch.getPolifylsWatch(), {usePolling: true}, gulp.series('buildPolifyls')).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.POLIFYLS, !!projectConf.outputs.getPolyfillsOutName()));
//     gulp.watch(projectConf.watch.getVendorsWatch(), {usePolling: true}, gulp.series('buildVendors')).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.VENDORS, !!projectConf.outputs.getVendorsOutName()));
//     gulp.watch(projectConf.watch.getJsWatch(), {usePolling: true}, gulp.series('js')).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.JS, !!projectConf.outputs.getScriptsOutName()));
// });

gulp.task('watch', function () {
    helpers.buildCaches.polifyls.watch = true;
    helpers.buildCaches.watch = true;
    if (!projectConf.src.scripts.isModuleScript()) {
        gulp.watch(projectConf.watch.getJsWatch(), {usePolling: true}, gulp.series('js'))
            .on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.JS, !!projectConf.outputs.getScriptsOutName()));
    }
    gulp.watch(projectConf.watch.getPolifylsWatch(), {usePolling: true}, gulp.series('buildPolifyls'))
        .on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.POLIFYLS, !!projectConf.outputs.getPolyfillsOutName()));
    gulp.watch(projectConf.watch.getVendorsWatch(), {usePolling: true}, gulp.series('buildVendors'))
        .on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.VENDORS, !!projectConf.outputs.getVendorsOutName()));
    gulp.watch(projectConf.watch.getCssWatch(), {usePolling: true}, gulp.series('css', statics.buildHtml(tasksConf.buildStaticConfig.html)))
        .on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.CSS, !!projectConf.outputs.getStylesOutName()));
    gulp.watch(projectConf.lint.getConfDir(), {usePolling: true}, gulp.series('clean:lintsCache'));
    gulp.watch(projectConf.watch.getHtmlWatch(), {usePolling: true},
        gulp.series(statics.buildHtml(tasksConf.buildStaticConfig.html))).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.HTML));
    gulp.watch(projectConf.watch.getImgWatch(), {usePolling: true},
        gulp.series(statics.buildImages(tasksConf.buildStaticConfig.images))).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.IMG));
    gulp.watch(projectConf.watch.getFontsWatch(), {usePolling: true},
        gulp.series(statics.buildFonts(tasksConf.buildStaticConfig.fonts))).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.FONTS));
    gulp.watch(projectConf.watch.getResourcesWatch(), {usePolling: true},
        gulp.series(statics.buildResources(tasksConf.buildStaticConfig.resources))).on('unlink', helpers.deleteFilesFromCache(CONST.CACHE_NAME.RESOURCES));
});


gulp.task('onlyTest', gulp.series(clean('tmpTest'), 'buildPolifyls', 'buildVendors', 'test'));

gulp.task('nope', function () {
    // NOP
});

gulp.task('serve', function () {
    browsersync.init({
        server: projectConf.dev.getDir(),
        middleware: function (req, res, next) {
            if (projectConf.getFrameWorkConfigByName('angular').isAngularRedirectToIndex()
                && !/\.[^.]+$/.test(req.url)) {
                req.url = '/index.html';
            }
            return next();
        }
    });
    browsersync.watch(projectConf.watch.getDevBuildWatch()).on('change', browsersync.reload);
});

let needRunTest = process.env.npm_config_test ? 'test' : 'nope';

if (helpers.isDevelopment()) {
    gulp.task('dev:init', function (callback) {
        helpers.createFolder(projectConf.dev.getScriptsDir());
        helpers.createFolder(projectConf.dev.getStylesDir());
        helpers.createFolder(projectConf.dev.getImgDir());
        helpers.createFolder(projectConf.dev.getFontsDir());
        helpers.createFolder(projectConf.dev.getResourcesDir());
        helpers.createFolder(projectConf.temps.getCachesTempDir());
        helpers.createFolder(projectConf.temps.getCachesLintTempDir());
        helpers.createFolder(projectConf.temps.getCachesVendorsTempDir());
        callback();
    });

    gulp.task('dev',
        gulp.series('clean', 'dev:init',
            gulp.parallel('statics', statics.buildImages(tasksConf.buildStaticConfig.images), 'js', 'css'),
            statics.buildHtml(tasksConf.buildStaticConfig.html),
            gulp.parallel(needRunTest, 'watch', 'serve')
        )
    );

    gulp.task('dev:aot',
        gulp.series(clean(), 'dev:init',
            statics.buildImages(tasksConf.buildStaticConfig.images),
            'buildPolifyls',
            'buildVendors',
            scripts.copyVendors(tasksConf.jsCopyVendors),
            gulp.parallel('statics', 'css', 'aot'),
            statics.buildHtml(tasksConf.buildStaticConfig.html),
            gulp.parallel(needRunTest, 'watch', 'serve')
        )
    );
}

if (helpers.isProduction()) {
    gulp.task('prod:init', function (callback) {

        helpers.createFolder(projectConf.prod.getScriptsDir());
        helpers.createFolder(projectConf.prod.getStylesDir());
        helpers.createFolder(projectConf.prod.getImgDir());
        helpers.createFolder(projectConf.prod.getFontsDir());
        helpers.createFolder(projectConf.prod.getResourcesDir());
        helpers.createFolder(projectConf.temps.getManifestTempDir());
        helpers.createFolder(projectConf.temps.getCachesTempDir());
        helpers.createFolder(projectConf.temps.getCachesLintTempDir());
        helpers.createFolder(projectConf.temps.getCachesVendorsTempDir());
        callback();
    });

    gulp.task('prod',
        gulp.series(clean(), 'prod:init',
            statics.buildImages(tasksConf.buildStaticConfig.images),
            gulp.parallel('statics', 'css', 'js'),
            statics.buildHtml(tasksConf.buildStaticConfig.html),
            clean('cache')
        )
    );

    gulp.task('prod:aot',
        gulp.series(clean(), 'prod:init',
            statics.buildImages(tasksConf.buildStaticConfig.images),
            gulp.parallel('statics', 'css', 'aot'),
            statics.buildHtml(tasksConf.buildStaticConfig.html)
        )
    );
}

