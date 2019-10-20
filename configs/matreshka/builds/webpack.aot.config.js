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
let AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

//TODO: Для АОТ компиляции сделать проверку на entryModule
module.exports = {
    mode: helpers.getMode(),
    output: {
        publicPath: helpers.isDevelopment() ? projectConf.dev.getScriptPublicPath() : projectConf.prod.getScriptPublicPath(),
        filename: '[name]',
    },
    devtool: helpers.isDevelopment() ? 'source-map' : '',
    plugins: [
        new webpack4.NoEmitOnErrorsPlugin(),
        new AotPlugin({
            tsConfigPath: "./tsconfig.aot.json"
        }),
        new ProgressPlugin()
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

if (projectConf.isUseFrameworkByName('angular')) {
    let loaders = {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: [
            {
                loader: '@ngtools/webpack',
            }
        ]
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