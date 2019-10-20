const path = require('path');
const CONST = require('../../../../utils/constants');

exports.getData = function (tempDir) {
    const manifestDir = path.resolve(tempDir, CONST.MANIFEST.DIR_NAME);
    return {
        get dir() {
            return manifestDir
        },
        css: {
            get path() {
                return manifestDir
            },
            get name() {
                return CONST.MANIFEST.FILE_NAMES.CSS + '.manifest.json'
            },
            get file() {
                return path.resolve(this.path, CONST.MANIFEST.FILE_NAMES.CSS + '.manifest.json')
            }
        },
        img: {
            get path() {
                return manifestDir
            },
            get name() {
                return CONST.MANIFEST.FILE_NAMES.IMG + '.manifest.json'
            },
            get file() {
                return path.resolve(this.path, CONST.MANIFEST.FILE_NAMES.IMG + '.manifest.json')
            }
        },
        js: {
            get path() {
                return manifestDir
            },
            get name() {
                return CONST.MANIFEST.FILE_NAMES.JS + '.manifest.json'
            },
            get file() {
                return path.resolve(this.path, CONST.MANIFEST.FILE_NAMES.JS + '.manifest.json')
            }
        },
        provided: {
            get path() {
                return manifestDir
            },
            get name() {
                return CONST.MANIFEST.FILE_NAMES.PROVIDED + '.manifest.json'
            },
            get file() {
                return path.resolve(this.path, CONST.MANIFEST.FILE_NAMES.PROVIDED + '.manifest.json')
            }
        }
    };
};