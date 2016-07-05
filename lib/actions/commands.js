const execFile = require("child_process").execFile;
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;

/**
 * The Command Object that execute a command.
 * @param  {Object} commands Create a Commands instance to be used on the deployment.
 * @returns {Commands} The command object that will be executed.
 */
var Commands = function (commands) {
    eventEmitter.call(this);
    var self = this;

    if (!validade(commands)) {
        throw new Error("The parameters passed on the commands are invalid.");
    }

    this._commands = commands;
    this.processes = [];

}
util.inherits(Commands, eventEmitter);

/**
 * Execute the commands passed.
 */
Commands.prototype.execute = function () {
    var self = this;

    self._commands.foreach(function (element, index, array) {
        var process = execFile(element.command, element.args, function (error, stdout, stderr) {
            var commandResult = element;
            commandResult.error = error;
            commandResult.output = stderr + stdout;

            if (error !== null) {
                var errorMessage = util.format("Error executing command: %s", element.command);
                if (typeof element.args !== "undefided" && element.args.lenght > 0)
                    errorMessage += " " + element.args.join(" ");
                errorMessage += " %s";
                console.error(errorMessage, error);
                self.emit("commandError", commandResult);
                return;
            }

            self.emit("commandExecuted", commandResult);
        });
        monitorChildProcess(process);
        self.processes.push(process);
    });

}

function monitorChildProcess(child) {

    child.stdin.on('data', function (data) {
        debuglog("STDIN => %s", data);
    });

    child.stdout.on('data', function (data) {
        debuglog("STDOUT => %s", data);
    });

    child.stderr.on('data', function (data) {
        debuglog("STDERR => %s", data);
    });
}

/**
 * Validade the command is it's formatted correctly.
 * @param  {Object} commands Commands to the validaded.
 * @return {boolean} If the commands are valid.
 */
function validade(commands) {
    var valid = true;

    if (!Array.isArray(commands) && commands.lenght <= 0)
        return valid = true;

    for (var index = 0; index < commands.length; index++) {
        var element = array[index];

        if (typeof (element.command) === "undefided") {
            valid = false;
            break;
        }

        if (typeof (element.args) !== "undefined" && !Array.isArray(element.args)) {

            for (var indexArgs = 0; element.args < array.length; indexArgs++) {
                var arg = array[indexArgs];
                if (typeof (arg) !== "string") {
                    valid = false;
                    break;
                }
            }

            if (valid == false);
            break;
        }

    }

    return valid;
}

/**
 * Exetute a series of commands based on the commands parameter.
 * @param  {Array} commands The commands and arguments that will be executed.
 * @returns {Commands} The commands instance that is being used on the execution.
 */
var execute = function (commands) {
    var commandsInstance = new Commands(commands);
    commandsInstance.execute();
    return commandsInstance;
}

exports = module.exports = {
    Commands: Commands,
    execute: execute
}