var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first()).select('B1');

var json = ee.Serializer.toJSON(image.select(0))

var region = JSON.stringify(image.select(0).geometry().bounds().getInfo())

print(region)

var params = {
  json:json,
  type:'EXPORT_IMAGE',
  description:'test',
  region:region,
  //crs:'EPSG:4326',
  dimensions:'100x100',
  pyramidingPolicy: '{"B1": "MEAN"}',  // optional, one of MEAN, SAMPLE, MIN, MAX, or MODE per band
  assetId:'users/gena/test-export'
}

var taskId = ee.data.newTaskId(1)

ee.data.startProcessing(taskId, params);
