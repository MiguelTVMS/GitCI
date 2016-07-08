'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;
const configloader = require("./configloader.js");
const configuration = configloader.loadAppConfig();

const actionVariableName = "_%sActions";

var Executor = function (scripts) {
    eventEmitter.call(this);
    var self = this;

    this._scripts = scripts;
    this._moduleMappings = configuration.moduleMapping;
    this._availableModules = [];
    //TODO: Make the available actions and order configurable.
    this._availableTypes = ["prepublish", "publish", "postpublish", "test", "error"];
    this._typesToExecute = [];

    getAvailableModules(this);
    getScripts(this);
    validadeActionsVsModules(this);

}
util.inherits(Executor, eventEmitter);

function getAvailableModules(self) {
    debuglog("Looking for available modules.");
    self._moduleMappings.forEach(function (availableModule) {
        debuglog("Module %s for action type %s found", availableModule.module, availableModule.action);
        self._availableModules.push(availableModule.action);
    });
}

function getScripts(self) {
    self._availableTypes.forEach(function (availableType) {
        debuglog("Looking for actions of type %s", availableType);
        self._scripts.forEach(function (currentType) {
            if (currentType.type == availableType) {
                debuglog("Found %s %s action(s)", currentType.actions.length, currentType.type);
                var variableName = util.format(actionVariableName, currentType.type);
                self[variableName] = currentType.actions;
                self._typesToExecute.push(variableName);
                return;
            }
        });
    });
}

function validadeActionsVsModules(self) {
    var modulesVariableNames = [];
    self._availableModules.forEach(function (availableModule) {
        var variableName = util.format(actionVariableName, availableModule);
        modulesVariableNames.push(variableName)
    });

    self._scripts.forEach(function (script) {
        script.actions.forEach(function (action) {
            if (self._availableModules.indexOf(action.type) < 0) {
                var errorMessage = util.format("Action %s is not supported.", action.type);
                debuglog(errorMessage);
                throw new RangeError(errorMessage);
            }
        });
    });
}

Executor.prototype.startDeploy = function () {



}



exports = module.exports = {

    Executor: Executor
}