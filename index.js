// include closure
var path = require('path');
var ee = require('@google/earthengine');

var fs = require('fs')
var request = require('request');

// define stubs for the classes used in the Code Editor
global.ee = ee;
global.print = function(arg) { if(arg) { console.log(arg); } }

if(!global.Map) {
  global.Map = function(arg) {}
}

global.Map.addLayer = function(arg) {}
global.Map.addCenterObject = function(arg) {}
global.Map.getBounds = function(arg) {}
global.Map.getCenter = function(arg) {}
global.Map.setCenter = function(arg) {}
global.Map.centerObject = function(arg) {}
global.Map.setOptions = function(arg) {}
global.Chart = function(arg) {}
global.Chart.image = function(arg) {}
global.Chart.image.histogram = function(arg) {}
global.commandLine = true
global.ui = function(arg) {}
global.ui.Chart = function(arg) { console.log('ui.Chart is not implemented yet') }
global.ui.Chart.image = global.ui.Chart
global.ui.Chart.image.doySeries = global.ui.Chart
global.ui.Chart.image.doySeriesByYear = global.ui.Chart
global.ui.Chart.image.doySeriesByRegion = global.ui.Chart


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
