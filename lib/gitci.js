'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;
const gitCapsule = require("gitcapsule");
const path = require("path");


var GitCI = function () {
    eventEmitter.call(this);
    var self = this;
}
util.inherits(GitCI, eventEmitter);

/**
 * Configure the GitCI instance before it may be used.
 * @param  {Object} self The GitCI instance that will be configured.
 * @param  {string} gitRepository The complete url for the Git repository that will be used for the deploy.
 * @param  {string} branch The branch that will be monitored for the deploy.
 * @param  {string} workspaceFolder The folder that will be used to put the local git repository.
 * @param  {string} configFile The configuration file 
 * @param  {number} pullInterval the interval in seconds from where the git repository should be pulled.
 */
function configureGitCI(self, gitRepository, branch, workspaceFolder, configFile, pullInterval) {
    workspaceFolder = path.resolve(__dirname, workspaceFolder);
    debuglog("Configuring GitCI with this options:\ngitRepository: \"%s\"\nbranch: \"%s\"\nworkspaceFolder: \"%s\"\nconfigFile: \"%s\"\npullInterval: \"%s\"\n",
        gitRepository, branch, workspaceFolder, configFile, pullInterval);

    self._options = {
        gitRepository: gitRepository,
        branch: branch,
        workspaceFolder: workspaceFolder,
        configFile: configFile,
        pullInterval: pullInterval * 1000
    }

    self.on('newListener', function (listener) {
        debuglog('New event listener: %s', listener);
        var availableListeners = [];
    });

    prepareGit(self);
}

/**
 * Prepare the Git instance to be used by the GitCI
 * @param  {Object} self The GitCI instance that will be configured.
 */
function prepareGit(self) {

    var repositoryOptions = {
        "prepareBasePath": true
    }

    debuglog("Creating the Git repository");
    self._gitRepository = gitCapsule.createGitRepository(self._options.workspaceFolder, repositoryOptions);

    self._gitRepository.clone(self._options.gitRepository, function (error, response) {
        if (error !== null) {
            console.error("Unable to clone the repository: " + error.toString());
            return;
        }

        startMonitoring(self);
    });
}

function startMonitoring(self) {
    debuglog("Setting up the pull timer.");
    self._pullTimer = setInterval(function (args) {
        clearInterval(self._pullTimer);
        debuglog("Pulling changes.");

        self._gitRepository.pull(function (error, response) {
            if (error !== null)
                console.error("Problems pulling the repository: " + error.toString());

            if (response.alreadyUpToDate) {
                debuglog("No changes found.");
                startMonitoring(self);
                return;
            }

            startExecution(self);

        });
    }, self._options.pullInterval);

}

function startExecution(self) {
    debuglog("Starting the deploy.");
}

/**
 * @param  {string} gitRepository The complete url for the Git repository that will be used for the deploy.
 * @param  {string} branch The branch that will be monitored for the deploy.
 * @param  {string} workspaceFolder The folder that will be used to put the local git repository.
 * @param  {string} configFile The configuration file 
 * @param  {number} pullInterval the interval in seconds from where the git repository should be pulled.
 * @returns {GitCI} The new GitCI instance.
 */
var createGitCI = function (gitRepository, branch, workspaceFolder, configFile, pullInterval) {
    var gitCI = new GitCI();
    configureGitCI(gitCI, gitRepository, branch, workspaceFolder, configFile, pullInterval);
    return gitCI;
}

exports = module.exports = {
    GitCI: GitCI,
    createGitCI: createGitCI
};