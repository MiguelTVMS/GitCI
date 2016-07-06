'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;
const configloader = require("./configloader.js");

const configuration = configloader.loadAppConfig();
const moduleMapping = configuration.moduleMapping;

var Executor = function (scripts) {
    eventEmitter.call(this);
    var self = this;

    this._availableActions = [
    ]
}
util.inherits(Executor, eventEmitter);



exports = module.exports = {
    Executor: Executor
}