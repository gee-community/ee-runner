var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());

print('Downloading thumbnail ...');

var t1 = Date.now();
var url = image.getThumbURL({dimensions:'1024', region: image.geometry().getInfo(), format: 'jpg'});
print(url)
download(url, 'hello_thumb.jpg');
var t2 = Date.now();
print('Elapsed: ' + (t2 - t1) + ' ms');
