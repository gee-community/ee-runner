# ee-runner

Command line runner of [Google Earth Engine Playground](https://ee-api.appspot.com/) scripts using Node.js.

[![Gitter](https://badges.gitter.im/gee-community/ee-runner.svg)](https://gitter.im/gee-community/ee-runner?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

### Install globally and use as a script

* npm install -g ee-runner (or npm update -g ee-runner)


* Run Code Editor scripts as:

```javascript
> ee-runner <script-file>
```

or 

```javascript
> ee <script-file>
```


### Install as a package

* npm install ee-runner


* in your scripts, use:

```javascript
require("ee-runner")

gee.initialize(function() {
  // ... your Google Earth Engine code comes here ...
})

```


### Install as a command-line tool from GitHub

* Clone this repository.
* Inside Repository
  * Run: npm run init

You may have to remove any previous and no longer valid tokens, for example having played with ee-python.
```rm ~/.config/earthengine/credentials```.

### Usage
* node ee-runner.js \<playground script file\>

### Example

* node ee-runner.js examples/hello.js

```
First image in LANDSAT 8 TOA collection was aquired on 2013-09-26
Downloading thumbnail ...
```

* cat examples/hello.js

```javascript
var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());
var info = image.getInfo();

var date = info.properties['DATE_ACQUIRED'];
print('First image in LANDSAT 8 TOA collection was aquired on ' + date);

print('Downloading thumbnail ...');

var url = image
  .visualize({bands:['B6','B5','B3'], gamma: 1.5})
  .getThumbURL({dimensions:'1024x1024', format: 'jpg'});

download(url, 'hello.jpg');

```

* hello.jpg

![hello.jpg](https://github.com/gena/ee-runner/blob/master/examples/hello.jpg?raw=true "Result")
