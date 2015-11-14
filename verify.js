var fs = require("fs");
var JSZip = require("jszip");

var file = process.argv[2];

// read a zip file
fs.readFile(file, function(err, data) {
  if (err) {
    console.log(file)
  }

  try {
    var zip = new JSZip(data);
  } catch(err) {
     console.log(file)
  }
});

              
