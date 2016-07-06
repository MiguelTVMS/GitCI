'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;

var Executor = function (scripts) {
    eventEmitter.call(this);
    var self = this;

    this._availableActions = [
        { name: "commands", scriptFile: "actions/commands.js" }
    ]
}
util.inherits(GitCI, eventEmitter);


