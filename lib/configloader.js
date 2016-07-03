'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const fs = require('fs');
const path = require("path")

/**
 * Load the configuration from the file at ../config/gitci.js
 * @return {Object} The configuration.
 */
exports = module.exports = function () {
    var configPath = path.resolve(__dirname, "../config/gitci.json");
    debuglog("Loading configuration from \"%s\"", configPath);

    if (!fs.existsSync(configPath)) {
        console.error("Unable to find the configuration file at \"%s\".", configPath);
        process.exit(1000);
    }

    try {
        var configurationText = fs.readFileSync(configPath, "UTF-8");
        var configuration = JSON.parse(configurationText);
        return configuration;
    } catch (error) {
        console.error("Unable parse the configuration file \"%s\": %s", configPath, error);
        process.exit(1001);
    }
}