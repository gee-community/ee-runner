var features = new ee.FeatureCollection(new ee.ImageCollection('LANDSAT/LC8_L1T_TOA')).limit(1);

var json = ee.Serializer.toJSON(features)

var params = {
    json: json,
    type: 'EXPORT_FEATURES',
    description: 'desc',
    driveFileNamePrefix: 'test',
    fileFormat: 'GeoJSON'
};

var taskId = ee.data.newTaskId(1);

ee.data.startProcessing(taskId, params);

