var image = new ee.Image(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA').first());

var region = JSON.stringify(image.select(0).geometry().bounds().getInfo())

print(region)

var params = {
  element: image.select(0),
  type: 'EXPORT_IMAGE',
  description: 'test',
  fileFormat: 'GEO_TIFF',
  region:region,
  //crs:'EPSG:4326',
  dimensions:'100x100',
  //scale: 30,
  driveFileNamePrefix:'test'
}

var taskId = ee.data.newTaskId(1)

ee.data.startProcessing(taskId, params);
