const NODE_ENV = process.env.NODE_ENV || 'dev';

let outputs = {};

exports.getMethods = function (projectOutputs) {
    outputs = projectOutputs;
    return {
        getStylesOutName: getStylesOutName,
        getScriptsOutName: getScriptsOutName,
        getPolyfillsOutName: getPolyfillsOutName,
        getVendorsOutName: getVendorsOutName
    };
};

function isProduction() {
    return NODE_ENV === 'prod';
}

function getStylesOutName() {
    if (isProduction()) {
        return outputs.styles + '.min.css';
    }
    return outputs.styles + '.css';
}

function getScriptsOutName() {
    if (isProduction()) {
        return outputs.scripts.files + '.min.js';
    }
    return outputs.scripts.files + '.js';
}

function getPolyfillsOutName() {
    if (isProduction()) {
        return outputs.polyfills + '.min.js';
    }
    return outputs.polyfills + '.js';
}

function getVendorsOutName() {
    if (isProduction()) {
        return outputs.scripts.vendors + '.min.js';
    }
    return outputs.scripts.vendors + '.js';
}
