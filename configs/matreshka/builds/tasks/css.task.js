'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const through2 = require('through2').obj;
const combiner = require('stream-combiner2').obj;
const path = require('path');
const fs = require('fs');
const cssimport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssurl = require('postcss-url');

const helpers = require('../../utils/helpers.utils');

//Task for css lint, optimized with file cache after check css files.
//For explain warning see: https://github.com/CSSLint/csslint/wiki/Rules-by-ID
//For exclude rules, see: https://github.com/lazd/gulp-csslint/issues/55
exports.cssLint = function (opt) {
    return function cssLint(done) {
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
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'css:lint'})))
            .pipe($.if(function (file) {
                    return opt.lint.result[file.path] && opt.lint.result[file.path].mtime === file.stat.mtime.toJSON();
                }, through2(function (file, enc, callback) {
                    file.csslint = opt.lint.result[file.path].csslint;
                    callback(null, file);
                }),
                combiner(
                    through2(function (file, enc, callback) {
                        file.contents = fs.readFileSync(file.path);
                        callback(null, file);
                    }),
                    $.csslint(opt.lint.configFile),
                    $.cond(helpers.mode.isDebug(), $.debug({title: 'csslint'})),
                    through2(function (file, enc, callback) {
                            opt.lint.result[file.path] = {
                                csslint: file.csslint,
                                mtime: file.stat.mtime.toJSON()
                            };
                            callback(null, file);
                        }
                    ))
            ))
            .pipe($.csslint.formatter())
            .pipe($.if(helpers.isProduction(),
                $.csslint.failFormatter().on('error', helpers.lintErrorReporter('css'))))
            .on('end', function () {
                helpers.createFolder(opt.cache);
                fs.writeFileSync(opt.lint.cacheFile, JSON.stringify(opt.lint.result));
            })
    }
};

exports.cssBuild = function (opt) {
    return function cssBuild(done) {
        if (!opt || !opt.src || opt.src.length === 0) {
            done();
            return;
        }
        return gulp.src(opt.src, {allowEmpty: true})
            .pipe($.plumber())
            .pipe($.if(helpers.isDevelopment(),
                combiner(
                    $.sourcemaps.init(),
                    $.if(!!opt.out, $.concat(`${opt.out}`))
                ))
            )
            .pipe(combiner(
                $.cond(helpers.mode.isDebug(), $.debug({title: 'Css common files'})),
                $.postcss([cssimport(), autoprefixer({browsers: ['last 2 version']}), cssurl()])
            ))
            .pipe($.if(helpers.isDevelopment(), combiner(
                $.sourcemaps.write(),
                gulp.dest(opt.devDst)
            )))
            .pipe($.if(helpers.isProduction(),
                combiner(
                    $.revReplace({
                        manifest: gulp.src(opt.manifest.img.file, {allowEmpty: true})
                    }),
                    $.uglifycss({'maxLineLen': 80, 'uglyComments': true}),
                    $.concat(`${opt.out || 'main.min.css'}`),
                    $.rev(),
                    gulp.dest(opt.prodDst),
                    $.rev.manifest(opt.manifest.css.name),
                    gulp.dest(opt.manifest.css.path)
                ))
            )
    }
};

