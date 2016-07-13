'use strict';
const util = require("util");
const debuglog = util.debuglog('gitci');
const eventEmitter = require('events').EventEmitter;
const gitCapsule = require("gitcapsule");
const path = require("path");
const executorModule = require("./executor.js");
const configloader = require("./configloader.js");
const stringModule = require("string")


var GitCI = function () {
    eventEmitter.call(this);
    var self = this;
}
util.inherits(GitCI, eventEmitter);

/**
 * Configure the GitCI instance before it may be used.
 * @param  {Object} self The GitCI instance that will be configured.
 * @param  {string} name Name of the deployment.
 * @param  {string} gitRepository The complete url for the Git repository that will be used for the deploy.
 * @param  {string} branch The branch that will be monitored for the deploy.
 * @param  {string} workspaceFolder The folder that will be used to put the local git repository.
 * @param  {string} configFile The configuration file 
 * @param  {number} pullInterval the interval in seconds from where the git repository should be pulled.
 */
function configureGitCI(self, name, gitRepository, branch, workspaceFolder, configFile, pullInterval) {
    workspaceFolder = path.resolve(__dirname, workspaceFolder);
    debuglog("Configuring GitCI with this options:\ngitRepository: \"%s\"\nbranch: \"%s\"\nworkspaceFolder: \"%s\"\nconfigFile: \"%s\"\npullInterval: \"%s\"\n",
        gitRepository, branch, workspaceFolder, configFile, pullInterval);

    self._options = {
        name: name,
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
        "prepareBasePath": false
    }

    debuglog("Obtaining the Git repository");
    self._gitRepository = gitCapsule.createGitRepository(self._options.workspaceFolder, repositoryOptions);

    self._gitRepository.status(function (error, dataStatus) {
        if (error !== null) {
            console.error(error.toString());
            return;
        }

        if (dataStatus.isRepository) {
            debuglog("Git repository found.");
            startMonitoring(self);
        }
        else {
            debuglog("Git repository not found. Cloning...");
            self._gitRepository.clone(self._options.gitRepository, function (error, dataClone) {
                if (error !== null) {
                    console.error("Unable to clone the repository: " + error.toString());
                    return;
                }
                startMonitoring(self);
            });
        }
    });
}

function startMonitoring(self) {
    debuglog("Setting up the pull timer.");
    self._pullTimer = setInterval(function (args) {
        clearInterval(self._pullTimer);
        var now = new Date();
        debuglog(now.toLocaleTimeString() + "Pulling changes.");

        self._gitRepository.pull(function (error, response) {
            if (error !== null)
                console.error("Problems pulling the repository: " + error.toString());

            if (response.alreadyUpToDate) {
                debuglog("No changes found.");
                startMonitoring(self);
                return;
            }

            debuglog("Changes found, starting deploy.");
        });
    }, self._options.pullInterval);

}

function getDeploymentData(self) {
    var deploymentDataPath = path.resolve(self._options.workspaceFolder, self._options.configFile);
    self._deploymentData = configloader.loadDeployConfig(deploymentDataPath);
}

function startExecution(self) {
    debuglog("Starting the %s deploy.", self._deploymentData.name);

    var executor = new executorModule.Executor(self._deploymentData.scripts);
    executor.startDeploy();
}

/**
 * @param  {string} gitRepository The complete url for the Git repository that will be used for the deploy.
 * @param  {string} branch The branch that will be monitored for the deploy.
 * @param  {string} workspaceFolder The folder that will be used to put the local git repository.
 * @param  {string} configFile The configuration file 
 * @param  {number} pullInterval the interval in seconds from where the git repository should be pulled.
 * @returns {GitCI} The new GitCI instance.
 */
var createGitCI = function (name, gitRepository, branch, workspaceFolder, configFile, pullInterval) {
    var gitCI = new GitCI();
    configureGitCI(gitCI, name, gitRepository, branch, workspaceFolder, configFile, pullInterval);
    return gitCI;
}

exports = module.exports = {
    GitCI: GitCI,
    createGitCI: createGitCI
};