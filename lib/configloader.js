'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const fs = require('fs');

module.exports = function () {
    var configPath = path.resolve(__dirname, "../config/gitci.js");

    if (!fs.existsSync(configPath)) {
        console.error("Unable to find the configuration file at \"%s\".", configPath);
        process.exit(1000);
    }

    try {
        var configurationText = fs.readFileSync(configPath);
        var configuration = JSON.parse(configurationText);
        return configuration;
    } catch (error) {
        console.error("Unable load the configuration file \"%s\": %s", configPath, error);
        process.exit(1001);
    }
}