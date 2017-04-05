var path = require('path');

require('./index.js')


// initialize google earth engine and call script
gee.initialize(function() {
  // parse command line
  var cmd = require('commander')

  cmd
    .version('0.0.1')
    .description('Google Earth Engine Playground code runner')
    .usage('ee-runner <path>')
    .parse(process.argv);

  if(cmd.args.length < 1) {
    cmd.help();
    process.exit();
  }

  global.args = cmd.args;
  var scriptName = cmd.args[0];
  var scriptPath = path.join(process.cwd(), scriptName);

  console.log('Running script: ' + scriptPath);
  require(scriptPath);
});