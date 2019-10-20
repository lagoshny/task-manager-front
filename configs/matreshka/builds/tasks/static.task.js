'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const combiner = require('stream-combiner2').obj;
const projectConf = require('../../v1/api/matreshka');
const path = require('path');

const helpers = require('../../utils/helpers.utils');

exports.buildHtml = function (opt) {
    return function buildHtml() {
        return gulp.src(...opt.src)
            .pipe($.plumber())
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'Static:html'})))
            .pipe($.if(helpers.isDevelopment(), combiner(
                $.cached(opt.cache),
                $.cond(helpers.mode.isDebug(), $.debug({title: 'Cached static:html'})),
                $.inject(gulp.src([
                            path.resolve(projectConf.dev.getScriptsDir(), projectConf.outputs.getPolyfillsOutName()),
                            path.resolve(projectConf.dev.getScriptsDir(), projectConf.outputs.getVendorsOutName()),
                            path.resolve(projectConf.dev.getScriptsDir(), projectConf.outputs.getScriptsOutName()),
                            path.resolve(projectConf.dev.getStylesDir(), projectConf.outputs.getStylesOutName())
                    ], {read: false, allowEmpty: true}),
                    {
                        ignorePath: ['../../../main/builds/development/'],
                        addRootSlash: false
                    }),
                gulp.dest(opt.devDst)
            )))
            .pipe($.if(helpers.isProduction(), combiner(
                $.inject(gulp.src([
                        helpers.prodNames.polifyls.hashPath,
                        helpers.prodNames.vendors.hashPath,
                        helpers.prodNames.scripts.hashPath,
                        helpers.prodNames.styles.hashPath,
                    ], {read: false, allowEmpty: true}),
                    {
                        ignorePath: ['../../../main/builds/production/'],
                        addRootSlash: false
                    }),
                $.revReplace({
                    manifest: gulp.src([
                        opt.manifest.img.file,
                        opt.manifest.provided.file,
                        opt.manifest.js.file], {allowEmpty: true})
                }),
                gulp.dest(opt.prodDst)
            )))
    }
};

exports.buildImages = function (opt) {
    return function buildImages() {
        return gulp.src(...opt.src)
            .pipe($.plumber())
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'Static:images'})))
            .pipe($.if(helpers.isDevelopment(), combiner(
                $.cached(opt.cache),
                $.cond(helpers.mode.isDebug(), $.debug({title: 'Cached static:images'})),
                gulp.dest(opt.devDst)
            )))
            .pipe($.if(helpers.isProduction(), combiner(
                $.imagemin([$.imagemin.optipng({optimizationLevel: 5})]),
                $.rev(),
                gulp.dest(opt.prodDst),
                $.rev.manifest(opt.manifest.img.name),
                gulp.dest(opt.manifest.img.path)
            )))
    };
};

exports.buildFonts = function (opt) {
    return function buildFonts() {
        return gulp.src(...opt.src)
            .pipe($.plumber())
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'Static:resources.fonts'})))
            .pipe($.if(helpers.isDevelopment(), combiner(
                $.cached(opt.cache),
                $.cond(helpers.mode.isDebug(), $.debug({title: 'Cached static:resources.fonts'})),
                gulp.dest(opt.devDst)
            )))
            .pipe($.if(helpers.isProduction(), gulp.dest(opt.prodDst)));
    }
};

exports.buildResources = function (opt) {
    return function buildResources() {
        return gulp.src(...opt.src)
            .pipe($.plumber())
            .pipe($.cond(helpers.mode.isDebug(), $.debug({title: 'Static:resources'})))
            .pipe($.if(helpers.isDevelopment(), combiner(
                $.cached(opt.cache),
                $.cond(helpers.mode.isDebug(), $.debug({title: 'Cached static:resources'})),
                gulp.dest(opt.devDst)
            )))
            .pipe($.if(helpers.isProduction(), gulp.dest(opt.prodDst)));
    };
};