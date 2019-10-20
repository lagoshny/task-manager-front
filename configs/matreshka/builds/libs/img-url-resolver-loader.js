/**
 * Change url for img tag on recived path in css files
 *
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 04.10.2017 22:12
 */
'use strict';
const path = require('path');
const loaderUtils = require('loader-utils');

const cssUrlsReg = [
    /(@import\s+)(')(.+?)(')/gi,
    /(@import\s+)(")(.+?)(")/gi,
    /(url\s*\()(\s*)([^\s'")].*?)(\))/gi,
    /(url\s*\()(\s*')([^']+?)(')/gi,
    /(url\s*\()(\s*")([^"]+?)(")/gi,
];

const imgSrc = /(<img\n|\r|.*)(src=)(")(.*)(")/gi;

module.exports = function (content) {
    let options = loaderUtils.getOptions(this);
    let newPath = options.path || '';
    let contentType = options.type || '';

    if (!contentType) {
        return content;
    }

    if (contentType === 'css' || contentType === 'scss') {
        return cssUrlsReg.reduce((content, reg) => {
            return content.replace(reg, (all, lead, quote1, currPath, quote2) => {
                return lead + quote1 + `${newPath}/${path.basename(currPath)}` + quote2;
            })
        }, content);
    }

    if (contentType === 'html') {
        // Get value for 4 group from regExp
        return getMatches(content, imgSrc, 4).reduce((content, currPath) => {
            return content.replace(currPath, `${newPath}/${path.basename(currPath)}`);
        }, content);
    }
};

function getMatches(string, regex, index) {
    index || (index = 4);
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}