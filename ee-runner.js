#!/usr/bin/env node

let path = require('path');

let pathIndex = path.join(__dirname, 'index.js');

require(pathIndex)

// parse command line
let cmd = require('commander')

cmd
  .version('0.0.1')
  .description('Google Earth Engine Playground code runner')
  .usage('<code-editor-script-path>')
  .option('-a, --authenticate', 'Authenticate user to acess Google Earth Engine and Google Cloud Storage')
  .parse(process.argv);

if(cmd.rawArgs.length < 3) {
  cmd.help();
  process.exit();
}

// initialize google earth engine and call script
gee.initialize(function() {
  global.args = cmd.args;
  let script = cmd.args[0];

  console.log('Running script: ' + script);

  script = path.resolve(script)

  require(script);
}, cmd.authenticate);