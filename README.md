# GitCI
Git based CI service

### Description
The idea of this project is to make a service that executes a deploy based on git an a set of configurarions.

### Status
Latest Version: [![npm version](https://badge.fury.io/js/gitci.svg)](https://badge.fury.io/js/gitci)

| Branch   | Build status |
|----------|:------------:|
| master   | [![Build Status](https://travis-ci.org/jmtvms/GitCI.svg?branch=master)](https://travis-ci.org/jmtvms/GitCI)  |
| develop  | [![Build Status](https://travis-ci.org/jmtvms/GitCI.svg?branch=develop)](https://travis-ci.org/jmtvms/GitCI)  |

### Native available actions

| Action   | Latest Version | Master | GitHub | NPM |
|----------|:--------------:|:------:|:------:|:---:|
| BaseAction | [![npm version](https://badge.fury.io/js/gitci-baseaction.svg)](https://badge.fury.io/js/gitci-baseaction) | [![Build Status](https://travis-ci.org/jmtvms/GitCI-BaseAction.svg?branch=master)](https://travis-ci.org/jmtvms/GitCI-BaseAction) | [Go](https://github.com/jmtvms/GitCI-BaseAction) | [Go](https://www.npmjs.com/package/gitci-baseaction) |
| CommandAction | [![npm version](https://badge.fury.io/js/gitci-commandaction.svg)](https://badge.fury.io/js/gitci-commandaction) | [![Build Status](https://travis-ci.org/jmtvms/GitCI-CommandAction.svg?branch=master)](https://travis-ci.org/jmtvms/GitCI-CommandAction) | [Go](https://github.com/jmtvms/GitCI-CommandAction) | [Go](https://www.npmjs.com/package/gitci-commandaction) |

### Changes
* Creating the module mapping to handle the internal actions and other user created actions.
* Now the app monitor a git repository and branch a try to start the deploy.
* The tests where removed since it's a long running app and Travis-CI will fail the build.

### To do
* Start executing action modules.
* Make usage of the CommandAction cretated for this app.

##### Follow the development status at [Trello](https://trello.com/b/kiEfErQ8)
