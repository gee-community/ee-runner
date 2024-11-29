var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA').first());
var info = image.getInfo();

var date = info.properties['DATE_ACQUIRED']
print('First image in LANDSAT 8 TOA collection was aquired on ' + date);

print('Downloading thumbnail ...');

var url = image
  .visualize({bands:['B6','B5','B3'], gamma: 1.5})
  .getThumbURL({dimensions:'1024x1024', format: 'jpg'});

print(url)

download(url, 'hello.jpg');
