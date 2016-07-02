#!/usr/bin/env node
'use strict';

const forever = require('forever-monitor');

var child = new (forever.Monitor)('lib/start.js', {
    max: 3,
    silent: false,
    args: []
});

child.on('exit', function () {
    console.log('GitCI has exited after 3 restarts.');
    process.exit(0);
});

child.start();