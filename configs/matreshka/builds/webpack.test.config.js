/**
 * Webpack configuration
 *
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 24.07.2017 22:59
 */
'use strict';

const webpack4 = require('webpack');
const fs = require('fs');

const helpers = require('../utils/helpers.utils');
const projectConf = require('../v1/api/matreshka');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const path = require('path');

let changeFileName;

function AddWatchWebpackPlugin() {
}

AddWatchWebpackPlugin.prototype.apply = function (compiler) {
    compiler.hooks.afterCompile.tapAsync('AddWatchWebpackPlugin', function (compilation, callback) {
        // Watch for root project dir
        compilation.contextDependencies.add(projectConf.src.getSrcDir());
        callback();
    });

    compiler.hooks.make.tapAsync('AddWatchWebpackPlugin', function (compilation, callback) {
        if (changeFileName) {
            let name = path.basename(changeFileName).replace('.ts', '');
            // When we change spec file, we need to build component file not spec file, because spec file use component file
            // And when we build component file, spec file will rebuild too.
            if (name.includes('.spec')) {
                const depEntry = SingleEntryPlugin.createDependency(changeFileName, name);
                // If component file exists then build it, else build single test file (it mean test file doesn't have dep on component)
                if (fs.existsSync(changeFileName.replace('.spec', ''))) {
                    compilation.addEntry(projectConf.src.getSrcDir(), depEntry, name.replace('.spec', ''), callback);
                } else {
                    compilation.addEntry(projectConf.src.getSrcDir(), depEntry, name, callback);
                }
            } else {
                const dep = SingleEntryPlugin.createDependency(changeFileName, name);
                compilation.addEntry(projectConf.src.getSrcDir(), dep, name, callback);
            }
            changeFileName = '';
        } else {
            callback();
        }
    });

    compiler.hooks.watchRun.tapAsync('AddWatchWebpackPlugin', function (compilation, callback) {

        /**
         * If file was changed, then watchFileSystem.watcher will object:
         * mtimes: {
         *   'PathToFileWhichWasChange': 'time in mls'
         * }
         * For example:
         *   mtimes: {'D:\Development\Projects\main\src\a2.ts': 1503649122899
         * }
         *
         * If you will watch to dir, it will have 2 objects:
         *
         * For example:
         *   mtimes: {
         *   'D:\Development\Projects\main\src\a2.ts___jb_tmp___': null,
         *   'D:\Development\Projects\main\src\a2.ts': 1503649122899
         * }
         *
         */
        if (compilation.watchFileSystem.watcher.mtimes !== {}) {
            let keys = Object.keys(compilation.watchFileSystem.watcher.mtimes);
            for (let file of keys.filter((item, pos) => keys.indexOf(item) === pos)) {
                // I will watch for js, ts files, and not dir.
                if (/\.ts|\.js/.test(file) && !/___jb_tmp___/.test(file)) {
                    // If mtimes exist, and time file changed is not null, then we save filePath
                    if (compilation.watchFileSystem.watcher.mtimes[file] !== null) {
                        changeFileName = file;
                    }
                }
            }
        }
        callback();
    });
};

module.exports = {
    mode: helpers.getMode(),
    output: {
        publicPath: '',
        filename: '[name].js',
    },
    plugins: [
        new webpack4.NoEmitOnErrorsPlugin(),
        new AddWatchWebpackPlugin(),
        new ProgressPlugin()
    ],
    module: {
        rules: []
    },
    resolve: {
        modules: [
            // path.resolve(projectConf.getMatreshkaDir, "utils"),
            path.resolve(projectConf.getProjectRootDir, 'node_modules'),
            projectConf.src.getSrcDir()
        ],
        extensions: ['.ts', '.js']
    },
    bail: helpers.isProduction()
};


if (!projectConf.src.scripts.isTs() && !projectConf.isUseFrameworkByName('angular')) {
    module.exports.module.rules.push(
        // Use babel loader for processing JS files
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            },
            include: [projectConf.src.getSrcDir()]
        }
    );
}


if (projectConf.src.scripts.isTs() || projectConf.isUseFrameworkByName('angular')) {
    let tsLoader = {
        // Use TS loader for processing TS files
        // Use angular2-template-loader for replace templateUrl: './some.html' to templateUrl: require('./some.html')
        test: /\.ts$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    //Fo speed build we are using this loader options, with TS isolatedModules compiler options
                    transpileOnly: helpers.isDevelopment(),
                    configFile:  path.resolve("tsconfig.json"),
                    compilerOptions: {
                        isolatedModules: helpers.isDevelopment(),
                    }

                }
            }
        ],
        include: [projectConf.src.getSrcDir()]
    };

    module.exports.module.rules.push(tsLoader);
    if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineStyles()
        || projectConf.getFrameWorkConfigByName('angular').isAngularInlineTemplate()) {
        tsLoader.use.push('angular2-template-loader');
        if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineStyles()) {
            module.exports.module.rules.push(
                {
                    test: /\.(css|scss)$/,
                    use: {
                        loader: 'raw-loader'
                    },
                    include: [projectConf.src.getSrcDir()]
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        'sass-loader'
                    ],
                    include: [projectConf.src.getSrcDir()]
                }
            );
        }
        if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineTemplate()) {
            module.exports.module.rules.push(
                {
                    test: /\.(html)$/,
                    use: {
                        loader: 'raw-loader'
                    },
                    include: [projectConf.src.getSrcDir()]
                }
            );
        }
    }
    if (projectConf.getFrameWorkConfigByName('angular').isAngularLazyRoute()) {
        tsLoader.use.push('angular2-router-loader');
    }
}

if (fs.existsSync(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest/polyfills.test.manifest.json'))) {
    module.exports.plugins.push(
        new webpack4.DllReferencePlugin({
            manifest: require(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest/polyfills.test.manifest.json'))
        })
    );
}
if (fs.existsSync(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest/vendors.manifest.json'))) {
    module.exports.plugins.push(
        new webpack4.DllReferencePlugin({
            manifest: require(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest/vendors.manifest.json'))
        })
    );
}
