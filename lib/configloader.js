'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const fs = require('fs');
const path = require("path");

/**
 * Load the GitCI configuration from the file at ../config/gitci.js
 * @return {Object} The configuration.
 */
var loadAppConfig = function () {
    var configLocation = path.resolve(__dirname, "../config/gitci.json");
    var configuration = loadConfigFile(configLocation);

    return configuration;
}

/**
 * Load the deployment configuration file.
 * @param  {string} configLocation The location from where the deploy configuration file should be loaded.
 * @return {Object} The deployment configuration.
 */
var loadDeployConfig = function (configLocation) {
    var configLocation = path.resolve(__dirname, configLocation);
    var configuration = loadConfigFile(configLocation);

    return configuration;
}

function loadConfigFile(configLocation) {
    debuglog("Loading configuration from \"%s\"", configLocation);

    if (!fs.existsSync(configLocation)) {
        console.error("Unable to find the configuration file at \"%s\".", configLocation);
        process.exit(1000);
    }

    try {
        var configurationText = fs.readFileSync(configLocation, "UTF-8");
        var configuration = JSON.parse(configurationText);
        return configuration;
    } catch (error) {
        console.error("Unable parse the configuration file \"%s\": %s", configLocation, error);
        process.exit(1001);
    }
}

exports = module.exports = {
    loadAppConfig: loadAppConfig,
    loadDeployConfig: loadDeployConfig
}