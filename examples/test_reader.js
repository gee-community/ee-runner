// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
  , filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);

  var lines = data.split('\n');
  for(var line = 0; line < lines.length; line++){
       console.log(lines[line]);
         //exportBasin(ee.Number(4080045890));
  }
});

