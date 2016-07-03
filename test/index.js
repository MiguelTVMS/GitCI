'use strict';

const forever = require('forever-monitor');

var child = new (forever.Monitor)('lib/index.js', {
    max: 1,
    silent: false,
    args: []
});

child.on('exit', function () {
    console.log('GitCI has ended.');
    process.exit(0);
});

child.start();