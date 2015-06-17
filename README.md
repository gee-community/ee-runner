# ee-runner

Command line runner of [Google Earth Engine Playground](https://ee-api.appspot.com/) scripts using Node.js.

Tested with [io.js](https://iojs.org) v2.2.1.

Install:

* Download and install [io.js](https://iojs.org).
* Clone or download this repository.
* npm install

Usage:

* node ee-runner.js hello.js

> Hello from Google Earth Engine!                                                                
> First LANDSAT 8 image is: LANDSAT/LC8_L1T/LC80010042013269LGN00 aquired on 2013-09-26          

* cat hello.js

```javascript
var image = ee.Image(ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());
var info = image.getInfo();

var date = info.properties['DATE_ACQUIRED']
print('First LANDSAT 8 image is: ' + info.id + ' aquired on ' + date);

print('Downloading thumbnail ...')

var url = image
  .visualize({bands:['B6','B5','B3'], gamma: 1.5})
  .getThumbURL({dimensions:'1024x1024', format: 'jpg'});

download(url, 'hello.jpg');
```