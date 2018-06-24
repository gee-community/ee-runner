#!/usr/bin/env node

var path = require('path');

var pathIndex = path.join(__dirname, 'index.js');

require(pathIndex)

// parse command line
var cmd = require('commander')

cmd
  .version('0.0.1')
  .description('Google Earth Engine Playground code runner')
  .usage('<code-editor-script-path>')
  .option('-a, --authenticate', 'Authenticate user to acess Google Earth Engine and Google Cloud Storage')
  .parse(process.argv);

if(cmd.rawArgs.length < 1) {
  cmd.help();
  process.exit();
}

// initialize google earth engine and call script
gee.initialize(function() {
  global.args = cmd.args;
  var script = cmd.args[0];

  console.log('Running script: ' + script);

  require(script);
}, cmd.authenticate);