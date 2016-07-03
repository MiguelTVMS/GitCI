'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');

console.log("Starting GitCI...");

debuglog("Loading configuration from file.");
var configurations = require("./configloader.js")();


console.log("Stoppig GitCI...");