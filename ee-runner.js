#!/usr/bin/env node

const path = require('path');

let pathIndex = path.join(__dirname, 'index.js');

require(pathIndex)

// parse command line
let cmd = require('commander')

cmd
  .version('1.0.0')
  .description('Google Earth Engine Playground code runner')
  .usage('<code-editor-script-path>')
  .option('-a, --authenticate', 'Authenticate user to acess Google Earth Engine and Google Cloud Storage')
  .option('-p, --project <project>', 'Google Cloud Project Name with Earth Engine API enabled and registered')
  .parse(process.argv);

if(cmd.rawArgs.length < 3) {
  cmd.help();
  process.exit();
}


// initialize google earth engine and call script
gee.initialize(function() {
  global.args = cmd.args;
  let script = cmd.args[0];

  if(cmd.authenticate) {
      process.exit() // just authenticate
  }

  console.log('Running script: ' + script);
  
  // TODO: if script is from users/* - fetch

  script = path.resolve(script)

  require(script);
}, cmd.authenticate, cmd.project);
