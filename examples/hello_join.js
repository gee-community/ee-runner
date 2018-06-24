ee.initializeUnboundMethods_()
ee.initializeGeneratedClasses_()
ee.ApiFunction.initialize()

var mosaicByTime = function (images, aoi) {
  var TIME_FIELD = 'system:time_start';

  var distinct = images.distinct([TIME_FIELD]);

  var filter = ee.Filter.equals({ leftField: TIME_FIELD, rightField: TIME_FIELD });
  var results = ee.Join.saveAll('matches').apply(distinct, images, filter);

  // mosaic
  results = results.map(function(i) {
    var mosaic = ee.ImageCollection.fromImages(i.get('matches'))
        .sort('system:index')
        .mosaic()
        .clip(aoi);

    return mosaic.copyProperties(i).set(TIME_FIELD, i.get(TIME_FIELD));
  });

  return ee.ImageCollection(results);
};


print(mosaicByTime(ee.ImageCollection.fromImages([])).getInfo())
