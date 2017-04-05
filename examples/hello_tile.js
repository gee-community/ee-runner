//var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());
var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').filterDate('2014-01-01', '2014-02-01').mean());

print('Downloading map tile ...');


var mapId = image.select(0).getMap();

//for(var i = 0; i < 5; i++) {
  var t1 = Date.now();
  var url = ee.data.getTileUrl(mapId, 1, 1, 2);
  print(url)
  download(url, 'hello_tile.png');
  var t2 = Date.now();
  print('Elapsed: ' + (t2 - t1) + ' ms');
//}
