'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const through2 = require('through2').obj;
const combiner = require('stream-combiner2').obj;
const path = require('path');
const fs = require('fs');
const webpack4 = require('webpack');
const webpackStream = require('webpack-stream');
const pipedWebpack = require('piped-webpack');
const del = require('del');
const glob = require('glob');
const helpers = require('../../utils/helpers.utils');
let logger = require('gulplog');

/*For configuration tslint, you can visit: https://palantir.github.io/tslint/usage/configuration/ */
// const program = tslint.Linter.createProgram(paths.typeScriptConfig, paths.folders.main.src.root);
exports.tsLint = function (opt) {
    return function tsLint(done) {
        if (!opt || !opt.lint || !opt.lint.files || opt.lint.files.length === 0) {
            done();
            return;
        }
        if (helpers.isExistPreviousCheck(opt.lint.result)) {
            try {
                opt.lint.result = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), opt.lint.cacheFile)));
            } catch (e) {
                // console.log(e);
            }
        }
        return gulp.src(opt.lint.files, {read: false})
            .pipe($.plumber({
                errorHandler: function (err) {
                    console.log(err.message);
                    this.emit('end');
                }
            })).pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'ts:lint'})))
            .pipe($.if(function (file) {
                    return opt.lint.result[file.path] && opt.lint.result[file.path].mtime === file.stat.mtime.toJSON();
                },
                through2(function (file, enc, callback) {
                    file.tslint = opt.lint.result[file.path].tslint;
                    file.tslint.failures = {};
                    callback(null, file);
                }),
                combiner(
                    through2(function (file, enc, callback) {
                        file.contents = fs.readFileSync(file.path);
                        callback(null, file);
                    }),
                    $.tslint({configuration: opt.lint.configFile}),
                    $.cond(helpers.mode.isDebug(), $.debug({title: 'tslint'})),
                    through2(function (file, enc, callback) {
                            file.tslint.failures = {};
                            opt.lint.result[file.path] = {
                                tslint: file.tslint,
                                mtime: file.stat.mtime.toJSON()
                            };
                            callback(null, file);
                        }
                    )
                )
            ))
            .pipe($.tslint.report({emitError: false}))
            .pipe($.if(helpers.isProduction(),
                $.tslint.report({emitError: true}).on('error', helpers.lintErrorReporter('TS'))))
            .on('end', function () {
                helpers.createFolder(opt.cache);
                fs.writeFileSync(opt.lint.cacheFile, JSON.stringify(opt.lint.result));
            });
    };
};

/*For configuration eslint, you can visit: http://eslint.org/docs/user-guide/migrating-to-3.0.0#requiring-configuration-to-run*/
exports.jsLint = function (opt) {
    return function jsLint(done) {
        if (!opt || !opt.lint || !opt.lint.files || opt.lint.files.length === 0) {
            done();
            return;
        }
        if (helpers.isExistPreviousCheck(opt.lint.result)) {
            try {
                opt.lint.result = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), opt.lint.cacheFile)));
            } catch (e) {
                // console.log(e);
            }
        }
        return gulp.src(opt.lint.files, {read: false})
            .pipe($.plumber())
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'js:lint'})))
            .pipe($.if(function (file) {
                    return opt.lint.result[file.path] && opt.lint.result[file.path].mtime === file.stat.mtime.toJSON();
                },
                through2(function (file, enc, callback) {
                    file.eslint = opt.lint.result[file.path].eslint;
                    callback(null, file);
                }),
                combiner(
                    through2(function (file, enc, callback) {
                        file.contents = fs.readFileSync(file.path);
                        callback(null, file);
                    }),
                    $.eslint({configFile: opt.lint.configFile}),
                    $.cond(helpers.mode.isDebug(), $.debug({title: 'eslint'})),
                    through2(function (file, enc, callback) {
                            opt.lint.result[file.path] = {
                                eslint: file.eslint,
                                mtime: file.stat.mtime.toJSON()
                            };
                            callback(null, file);
                        }
                    )
                )
            ))
            .pipe($.eslint.format())
            .pipe($.if(helpers.isProduction(),
                $.eslint.failAfterError().on('error', helpers.lintErrorReporter('JS'))))
            .on('end', function () {
                helpers.createFolder(opt.cache);
                fs.writeFileSync(opt.lint.cacheFile, JSON.stringify(opt.lint.result));
            });
    };
};


exports.copyVendors = function (opt) {
    return function copyVendors() {
        const files = [];
        if (helpers.isProduction()) {
            files.push(`${opt.cache}/*-*.js`);
        } else {
            files.push(`${opt.cache}/*.js`);
            files.push(`${opt.cache}/*.js.map`);
        }
        return gulp.src([...files, `!${opt.cache}/*.${helpers.constants.testSuffix}.js`], {allowEmpty: true})
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'Copy vendors'})))
            .pipe(gulp.dest(helpers.isDevelopment() ? opt.devDst : opt.prodDst));
    };
};

exports.jsTestBuild = function (opt) {
    let polyfillsFile = {};
    let needBuildNameFiles = [];
    if (!opt.testFiles) {
        console.error('You dont set test files!');
        return;
    }
    for (let file of opt.testFiles) {
        needBuildNameFiles.push(...glob.sync(file).map(file => path.basename(file).replace(/\.[^.]+$/, '')));
    }
    return function testJsBuild(done) {
        if (!opt || !opt.src || opt.src.length === 0 || !opt.scriptsConf.isTest()) {
            done();
            return;
        }
        let webpackConfig = require(opt.wbpConf);
        webpackConfig.watch = opt.scriptsConf.isTdd() || opt.scriptsConf.isSingleTdd();
        return gulp.src(opt.src)
            .pipe($.plumber())
            .pipe($.if(!opt.scriptsConf.isModuleScript(),
                combiner(
                    $.babel({
                        presets: ['es2015']
                    }),
                    $.if(helpers.isDevelopment(),
                        combiner(
                            $.cached(opt.cache.name),
                            $.cond(helpers.mode.isDebug(), $.debug({title: 'JS cache'})),
                            $.debug({title: 'JS build'}),
                            gulp.dest(opt.testCacheDir)
                        )
                    )
                )))
            .pipe($.if(opt.scriptsConf.isModuleScript(),
                combiner(
                    through2(function (file, enc, callback) {
                        // Save polyfills file in var because we will use it later for adding polyfills to main test file
                        if (opt.scriptsConf.getTestPolifyls().find(filePath => filePath === file.path)) {
                            polyfillsFile = file;
                            // If we don't push files, and invoke callback() w/o params it means this file doesn't pass to next pipe
                            callback();
                            return;
                        }
                        /** We need add polyfills to test main files */
                        if (opt.scriptsConf.isPolifyls() && Object.keys(polyfillsFile).length !== 0
                            && helpers.constants.testSuffixPattern.test(file.path)) {
                            file.named = file.stem;
                            polyfillsFile.named = file.stem;
                            this.push(polyfillsFile);
                            this.push(file);
                            callback();
                            return;
                        }
                        /** Else we do nothing with file name and let it as original file name */
                        /** webpack-stream use file.named for entries */
                        file.named = file.stem;
                        callback(null, file);
                    }),
                    webpackStream(webpackConfig, webpack4, function (err, stats) {
                        if (err) return;
                        if (helpers.mode.isDebug()) {
                            logger.info(stats.toString(helpers.logStatsInfoOptions));
                        } else {
                            // Using warn level because I want to hide all gulp task logs which info level, but want to see webpack logs
                            logger.warn(stats.toString(helpers.logStatsTestDefaultOptions));
                        }
                    }),
                    $.if(helpers.isDevelopment(), gulp.dest(opt.testCacheDir))
                )))
            .on('data', function (file) {
                /** This need for done task after processing all files otherwise if webpack has watch mode it will be hang up*/
                if (needBuildNameFiles.indexOf(file.stem) !== -1) {
                    needBuildNameFiles.splice(needBuildNameFiles.indexOf(file.stem), 1);
                }
                if (needBuildNameFiles.length === 0) {
                    done();
                }
            });
    };
};

exports.jsBuild = function (opt) {
    let needBuildNameFiles = [];
    let polyfillsFile = {};
    if (opt.scriptsConf.isPolifyls()) {
        needBuildNameFiles.push(opt.polyfillsOut);
    } else if (opt.scriptsConf.isTs()) {
        needBuildNameFiles.push(glob.sync(...opt.scriptsConf.getTsFiles()).map(file => path.basename(file).replace(/\.[^.]+$/, '')));
    }
    return function jsBuild(done) {
        if (!opt || !opt.src || opt.src.length === 0) {
            done();
            return;
        }
        return gulp.src(opt.src)
            .pipe($.plumber())
            .pipe($.if(!opt.scriptsConf.isModuleScript(),
                combiner(
                    $.babel({
                        presets: ['es2015']
                    }),
                    $.if(helpers.isDevelopment(),
                        combiner(
                            $.cached(opt.cache.name),
                            $.cond(helpers.mode.isDebug(), $.debug({title: 'JS cache'})),
                            $.sourcemaps.init(),
                            $.if(!!opt.scriptsOut,
                                combiner(
                                    $.remember(opt.cache.name),
                                    $.concat(`${opt.scriptsOut}.js`)
                                )
                            ),
                            $.debug({title: 'JS build'}),
                            $.sourcemaps.write(),
                            gulp.dest(opt.devDst)
                        )
                    )
                )))
            .pipe($.if(opt.scriptsConf.isModuleScript(),
                combiner(
                    through2(function (file, enc, callback) {
                        // Save polyfills file in var because we will use it later for adding polyfills to main test file
                        if (opt.scriptsConf.isPolifyls()
                            && opt.scriptsConf.getPolifyls().find(filePath => filePath === file.path)) {
                            polyfillsFile = file;
                            // If we don't push files, and invoke callback() w/o params it means this file doesn't pass to next pipe
                            callback();
                            return;
                        }
                        /** If we use polyfills, we don't save file names, and we do one file */
                        if (opt.scriptsConf.isPolifyls() && Object.keys(polyfillsFile).length !== 0) {
                            // file.named = file.stem;
                            file.named = opt.scriptsOut || file.stem;
                            polyfillsFile.named = file.named;
                            this.push(polyfillsFile);
                            this.push(file);
                            callback();
                            return;
                        }
                        /** Else we do file name as out, or their original name */
                        file.named = file.stem;
                        // file.named = opt.scriptsOut || file.stem;
                        callback(null, file);
                    }),
                    webpackStream(require(opt.wbpConf), webpack4, function (err, stats) {
                        if (err) return;
                        if (helpers.mode.isDebug()) {
                            logger.info(stats.toString(helpers.logStatsInfoOptions));
                        } else {
                            // Using warn level because I want to hide all gulp task logs which info level, but want to see webpack logs
                            logger.warn(stats.toString(helpers.logStatsOnlyErrorOptions));
                        }
                    }),
                    $.if(helpers.isDevelopment(), gulp.dest(opt.devDst))
                )))
            .pipe($.if(!opt.scriptsConf.isModuleScript() && helpers.isProduction(), $.uglifyjs(opt.scriptsOut || helpers.prodNames.scripts.name)))
            .pipe($.if(helpers.isProduction(),
                combiner(
                    $.if(opt.scriptsConf.isModuleScript(), $.concat(opt.scriptsOut || helpers.prodNames.scripts.name)),
                    $.rev(),
                    $.revReplace({
                        manifest: gulp.src([opt.manifest.img.file], {allowEmpty: true})
                    }),
                    gulp.dest(opt.prodDst)
                )))
            .on('data', function (file) {
                /** This need for done task after processing all files otherwise if webpack has watch mode it will be hang up*/
                if (needBuildNameFiles.indexOf(file.stem) !== -1) {
                    needBuildNameFiles.splice(needBuildNameFiles.indexOf(file.stem), 1);
                }
                if (needBuildNameFiles.length === 0) {
                    done();
                }
            });
    };
};

exports.providedBuild = function (opt) {
    // When run build, we need to check if already polifyls files exists
    try {
        opt.cache.lastModify = JSON.parse(fs.readFileSync(opt.cache.cacheLastModify));
        let existFiles = fs.readdirSync(opt.filesDir);
        let srcFiles = opt.src.map(function (file) {
            return file.replace(`${opt.filesDir}\\`, '');
        });

        if (Object.keys(opt.cache.lastModify).length === srcFiles.length) {
            for (let file of srcFiles) {
                let filePattern = new RegExp(file);
                let foundedFile = existFiles.filter((entry) => filePattern.test(entry));
                if (foundedFile.length === 0) {
                    opt.cache.needRebuild = true;
                    break;
                }
                let fullPathToFoundedFile = path.resolve(opt.filesDir, ...foundedFile);
                let foundedFileStats = fs.statSync(fullPathToFoundedFile);
                opt.cache.needRebuild = !(opt.cache.lastModify[fullPathToFoundedFile].mtime === foundedFileStats.mtime.toJSON());
            }
        } else {
            opt.cache.lastModify = {};
        }
    } catch (e) {
        // console.log(e);
        opt.cache.needRebuild = true;
    }
    return function providedBuild(done) {
        if (opt && !opt.handle) {
            done();
            return;
        }
        opt.cache.needRebuild = opt.cache.needRebuild || opt.cache.watch;
        return gulp.src(opt.src)
            .pipe($.plumber())
            .pipe($.if(opt.cache.needRebuild,
                combiner(
                    $.if(helpers.isDevelopment(),
                        combiner(
                            $.cached(opt.cache.name),
                            $.cond(helpers.mode.isDebug(), $.debug({title: `${opt.cache.title} cached files`})),
                            $.if(!!opt.out, $.remember(opt.cache.name)),
                            through2(function (file, enc, callback) {
                                opt.cache.lastModify[file.path] = {mtime: file.stat.mtime.toJSON()};
                                callback(null, file);
                            })
                        )
                    ),
                    $.if(!opt.handleModules,
                        combiner(
                            $.if(helpers.isDevelopment(), $.sourcemaps.init()),
                            $.if(!!opt.out, $.concat(`${opt.out}.js`)),
                            $.if(helpers.isDevelopment(), $.sourcemaps.write()),
                            $.debug({title: `${opt.cache.title} build files`}),
                            $.if(helpers.isDevelopment(), gulp.dest(opt.cache.dir))
                        )
                    ),
                    $.if(opt.handleModules,
                        combiner(
                            pipedWebpack(require(opt.wbpLibConf))
                        )
                    ),
                    gulp.dest(opt.cache.dir)
                ))
            )
            .pipe($.if(helpers.isProduction(),
                combiner(
                    through2(function (file, enc, callback) {
                        if (file.extname === '.json') {
                            callback();
                            return;
                        }
                        callback(null, file);
                    }),
                    $.uglifyjs(opt.prodName)))
            )
            .pipe($.if(helpers.isProduction(), combiner(
                $.rev(),
                $.debug({title: `${opt.cache.title} build files`}),
                gulp.dest(opt.dst))
            ))
            .on('end', function () {
                if (opt.cache.needRebuild && helpers.isDevelopment()) {
                    helpers.createFolder(opt.cache.dir);
                    if (fs.existsSync(opt.cache.cacheLastModify)) {
                        del.sync(opt.cache.cacheLastModify, {force: true});
                    }
                    fs.writeFileSync(opt.cache.cacheLastModify, JSON.stringify(opt.cache.lastModify));
                }
                done();
            });
    };
};

