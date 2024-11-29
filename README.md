# ee-runner

Command line runner of [Google Earth Engine Playground](https://ee-api.appspot.com/) scripts using Node.js.

[![Gitter](https://badges.gitter.im/gee-community/ee-runner.svg)](https://gitter.im/gee-community/ee-runner?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

### Install or update globally and use as a script

* `npm install -g ee-runner@latest`

* Run Code Editor scripts as:

```javascript
> ee-runner <script-file> --project=<cloud-project-name>
```

or 

```javascript
> ee <script-file> --project=<cloud-project-name>
```


### Install as a package

* `npm install ee-runner`


* in your scripts, use:

```javascript
require("ee-runner")

gee.initialize(function() {
  // ... your Google Earth Engine code comes here ...
}, project)

```


### Install as a command-line tool from GitHub

* Clone this repository.
* Inside Repository
  * `Run: npm run init`

### Authenticate

If you don't have Python version of Earth Engine installed - install it and run `earthengine authenticate` command.

### Usage
* `node ee-runner.js <script-file> --project=<cloud-project-name>`

### Example

* `node ee-runner.js examples/hello.js --project=ee-runner-test`

```
First image in LANDSAT 8 TOA collection was aquired on 2013-09-26
Downloading thumbnail ...
```

* cat examples/hello.js

```javascript
var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA').first());
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

### Roadmap

- [ ] Fetch user scripts from https://earthengine.googlesource.com/
- [ ] Implement ui.Chart printing to PNG / SVG

