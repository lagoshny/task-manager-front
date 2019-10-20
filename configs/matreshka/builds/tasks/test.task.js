/**
 * Created by Ilya Lagoshny (ilya@lagoshny.ru)
 *
 * Date: 20.08.2017 11:44
 */
'use strict';

const Server = require('karma').Server;
const projectConf = require('../../v1/api/matreshka');

exports.testRun = function (opt) {
    return function testRun(done) {
        if (opt.handle) {
            new Server({
                configFile: opt.config,
                autoWatch: projectConf.src.scripts.isTdd(),
                port: 9876,
                singleRun: !projectConf.src.scripts.isTdd() && (projectConf.src.scripts.isTest() || projectConf.src.scripts.isSingleTdd()),
                files: opt.src
            }, done).start();
            done();
        } else {
            done();
        }
    }

};