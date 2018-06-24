/***
 * Sentinel-2 produces multiple images, resultsing sometimes 4x more images than the actual size.
 * This is bad for any statistical analysis.
 * 
 * by Genna
 *
 * This function mosaics images by time.
 */

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

var images = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(ee.Geometry.Point([4.888916015625, 52.3755991766591]))


// print(images.count().getInfo())

print('Initialized: ' + ee.data.initialized_)

images = mosaicByTime(images)

print(images.count().getInfo())



