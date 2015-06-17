# ee-runner

Command line runner of [Google Earth Engine Playground](https://ee-api.appspot.com/) scripts using Node.js.

Tested with [io.js](https://iojs.org) v2.2.1.

Install:

* Download and install [io.js](https://iojs.org).
* Clone or download this repository.
* Run: npm install

Usage:
* node ee-runner.js \<playground script file\>


For example:

* node ee-runner.js hello.js

> First LANDSAT 8 TOA image is aquired on 2013-09-26
> Downloading thumbnail ...

* cat hello.js

```javascript
var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());
var info = image.getInfo();

var date = info.properties['DATE_ACQUIRED']
print('First image in LANDSAT 8 TOA collection was aquired on ' + date);

print(info);

print('Downloading thumbnail ...');

var url = image
  .visualize({bands:['B6','B5','B3'], gamma: 1.5})
  .getThumbURL({dimensions:'1024x1024', format: 'jpg'});

download(url, 'hello.jpg');
```

