# ee-runner

Command line runner of [Google Earth Engine Playground](https://ee-api.appspot.com/) scripts using Node.js.

Tested (Windows and Ubuntu) with [io.js](https://iojs.org) v2.2.1.

On Ubuntu make sure a proper version is selected: nvm use iojs-v2.2.1

### Install

* Download and install [io.js](https://iojs.org).
* Clone or download this repository.
* Run: npm install

### Usage
* node ee-runner.js \<playground script file\>

### Example

* node ee-runner.js hello.js

```
First image in LANDSAT 8 TOA collection was aquired on 2013-09-26
Downloading thumbnail ...
```

* cat hello.js

```javascript
var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());
var info = image.getInfo();

var date = info.properties['DATE_ACQUIRED']
print('First image in LANDSAT 8 TOA collection was aquired on ' + date);

print('Downloading thumbnail ...');

var url = image
  .visualize({bands:['B6','B5','B3'], gamma: 1.5})
  .getThumbURL({dimensions:'1024x1024', format: 'jpg'});

download(url, 'hello.jpg');

```

* hello.jpg

![hello.jpg](https://github.com/gena/ee-runner/blob/master/hello.jpg?raw=true "Result")
