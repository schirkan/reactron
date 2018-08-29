// main entry file for electron
const backendService = require('./dist/backendService');
backendService.instance.start(__dirname);