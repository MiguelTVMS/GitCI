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

### Changes
* Now the app monitor a git repository and branch a try to start the deploy.
 * The deployment process is not developed yet.
* The tests where removed since it's a long running app and Travis-CI will fail the build.
