/**
 * Webpack configuration
 *
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 24.07.2017 22:59
 */
'use strict';

const path = require('path');
const webpack4 = require('webpack');
const fs = require('fs');
const projectConf = require('../v1/api/matreshka');
const helpers = require('../utils/helpers.utils');
// var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

module.exports = {
    mode: helpers.getMode(),
    output: {
        publicPath: helpers.isDevelopment() ? projectConf.dev.getScriptPublicPath() : projectConf.prod.getScriptPublicPath(),
        filename: helpers.isDevelopment() ? '[name]' : '[name]',
    },
    devtool: helpers.isDevelopment() ? 'source-map' : '',
    plugins: [
        new webpack4.NoEmitOnErrorsPlugin(),
        new webpack4.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)esm5/, projectConf.src.getSrcDir()),
        new ProgressPlugin()
        // new WebpackBuildNotifierPlugin({
        //     title: "My Project Webpack Build",
        //     logo: path.resolve("./img/favicon.png"),
        //     suppressSuccess: true
        // })
    ],
    module: {
        rules: []
    },
    resolve: {
        modules: [
            path.resolve(projectConf.getProjectRootDir, 'node_modules'),
            projectConf.src.getSrcDir()
        ],
        extensions: ['.ts', '.js']
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'libs')]
    },
    profile: true,
    bail: helpers.isProduction(),
    watch: helpers.isDevelopment(),
    watchOptions: {
        poll: 400
    }
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
    let loaders = {
        // Use TS loader for processing TS files
        // Use angular2-template-loader for replace templateUrl: './some.html' to templateUrl: require('./some.html')
        test: /\.ts$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    //Fo speed build we are using this loader options, with TS isolatedModules compiler options
                    transpileOnly: helpers.isDevelopment(),
                    configFile: path.resolve("tsconfig.json"),
                    compilerOptions: {
                        isolatedModules: helpers.isDevelopment(),
                    }
                }
            }
        ],
        include: [projectConf.src.getSrcDir()]
    };

    module.exports.module.rules.push(loaders);

    if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineStyles()
        || projectConf.getFrameWorkConfigByName('angular').isAngularInlineTemplate()) {

        loaders.use.push('angular2-template-loader');
        if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineStyles()) {
            module.exports.module.rules.push(
                {
                    test: /\.(css|scss)$/,
                    use: [
                        'raw-loader'
                    ],
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
            module.exports.module.rules.push(
                {
                    test: /\.(css|scss)$/,
                    use: [
                        {
                            loader: 'img-url-resolver-loader',
                            options: {
                                path: projectConf.dev.getImgDirRelative(),
                                type: 'css'
                            }

                        }
                    ],
                    include: [projectConf.src.getSrcDir()]
                }
            );
        }
        if (projectConf.getFrameWorkConfigByName('angular').isAngularInlineTemplate()) {
            module.exports.module.rules.push(
                {
                    test: /\.(html)$/,
                    use: [
                        'raw-loader'
                    ],
                    include: [projectConf.src.getSrcDir()]
                }
            );
            module.exports.module.rules.push(
                {
                    test: /\.(html)$/,
                    use: [
                        {
                            loader: 'img-url-resolver-loader',
                            options: {
                                // path: buildConf.folders.main.builds.dev.img.relative,
                                path: projectConf.dev.getImgDirRelative(),
                                type: 'html'
                            }

                        }
                    ],
                    include: [projectConf.src.getSrcDir()]
                }
            );
        }
    }
    if (projectConf.getFrameWorkConfigByName('angular').isAngularLazyRoute()) {
        loaders.use.push('angular2-router-loader');
    }
}

if (helpers.isDevelopment()) {
    try {
        let existManifestFiles = fs.readdirSync(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest'));
        for (let manifest of existManifestFiles) {
            if (/\.test\./.test(manifest)) {
                continue;
            }
            module.exports.plugins.push(
                new webpack4.DllReferencePlugin({
                    manifest: require(path.resolve(projectConf.temps.getCachesVendorsTempDir(), 'manifest', manifest))
                })
            );
        }
    } catch (e) {
        // NOP
    }
}
