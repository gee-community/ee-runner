// include closure
var path = require('path');
var closureBasePath = path.join(__dirname, '/ext/closure-library/closure/goog' + path.sep);
var goog = require('closure').Closure({CLOSURE_BASE_PATH: closureBasePath});
require('./ext/closure-library/closure/goog/bootstrap/nodejs')

/*
var path = require('path');
var closureBasePath = path.join(__dirname, '/ext/closure-library/closure/goog/');
print(closureBasePath)
var goog = require('closure').Closure({CLOSURE_BASE_PATH: closureBasePath});

*/

// include fixed version of XMLHttpRequest (supports sync calls)
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
// global.XMLHttpRequest = require('./ext/xmlhttprequest-sync/lib/XMLHttpRequest').XMLHttpRequest;

// include GEE sources
require('./ext/earthengine-api/javascript/src/encodable')
require('./ext/earthengine-api/javascript/src/serializer')
require('./ext/earthengine-api/javascript/src/data')
require('./ext/earthengine-api/javascript/src/computedobject')
require('./ext/earthengine-api/javascript/src/types')
require('./ext/earthengine-api/javascript/src/function')
require('./ext/earthengine-api/javascript/src/apifunction')
require('./ext/earthengine-api/javascript/src/element')
require('./ext/earthengine-api/javascript/src/filter')
require('./ext/earthengine-api/javascript/src/collection')
require('./ext/earthengine-api/javascript/src/number')
require('./ext/earthengine-api/javascript/src/string')
require('./ext/earthengine-api/javascript/src/date')
require('./ext/earthengine-api/javascript/src/list')
require('./ext/earthengine-api/javascript/src/dictionary')
require('./ext/earthengine-api/javascript/src/geometry')
require('./ext/earthengine-api/javascript/src/feature')
require('./ext/earthengine-api/javascript/src/customfunction')
require('./ext/earthengine-api/javascript/src/featurecollection')
require('./ext/earthengine-api/javascript/src/image')
require('./ext/earthengine-api/javascript/src/imagecollection')
require('./ext/earthengine-api/javascript/src/terrain')
require('./ext/earthengine-api/javascript/src/ee')

require('./ext/earthengine-api/javascript/src/maptilemanager')

var fs = require('fs')
var request = require('request');

// replacements used in playground code
global.print = function(arg) { if(arg) { console.log(arg); } }
global.Map = function(arg) {}
global.Map.addLayer = function(arg) {}
global.Map.addCenterObject = function(arg) {}
global.Map.getBounds = function(arg) {}
global.Map.getCenter = function(arg) {}
global.Map.centerObject = function(arg) {}
global.Map.setOptions = function(arg) {}
global.Chart = function(arg) {}
global.Chart.image = function(arg) {}
global.Chart.image.histogram = function(arg) {}
global.commandLine = true


// First, checks if it isn't implemented yet.
if (!global.String.prototype.format) {
  global.String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

global.download = function(url, path, onsuccess) {
  var finished = false;

  var downloadAsync = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  downloadAsync(url, path, function(){
    if(onsuccess) {
      onsuccess(url, path)
    }

    finished = true;
  });

  while(!finished) {		
     require('deasync').sleep(100);		
  }
}

global.validate_zip = function(path, onsuccess) {
  var JSZip = require("jszip");

  var finished = false;

  // read a zip file
  fs.readFile(path, function(err, data) {
    if (err) throw err;
    var zip = new JSZip(data);

    onsuccess(path)

    finished = true;
  });

  while(!finished) {		
     require('deasync').sleep(100);		
  }
}

global.save = function(text, path) {
  fs.writeFile(path, text, function(err) {
    if(err) {
      console.log(err);
    }
  });
}

// setup authorization
gee = require('./authenticate')
