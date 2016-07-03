'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const gitCi = require('./gitci.js');

console.log("Starting GitCI...");

debuglog("Loading configuration from file.");
var configloader = require("./configloader.js");
var configuration = configloader.loadAppConfig();

var deploymentsRunning = [];

function createDeployment(element, index, array) {
    debuglog("Starting running deployment %s", index + 1);

    var options = element;
    var deployment = gitCi.createGitCI(
        options.gitRepository,
        options.branch,
        options.workspaceFolder,
        options.configFile,
        options.pullInterval);

    deploymentsRunning.push(deployment);
}

configuration.deployments.forEach(createDeployment);

console.log("Stoppig GitCI...");