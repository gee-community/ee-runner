// export SRTM for HydroBASIN

// var accuracy = 500 // m
// var buffer_size = 5000

var accuracy = 30 // m
var buffer_size = 0
var smoothen = true
var burn_water = true
var water_percentile = 20; // percentile to use for water (compute using all Landsat8 images)
var ndwi_threshold = 0
//var ndwi_bands = ['red_mean', 'nir_mean']
var ndwi_bands = ['green_mean', 'nir_mean']
var dem_min=0
var dem_max=500

// I(n+1, i, j) = I(n, i, j) + lambda * (cN * dN(I) + cS * dS(I) + cE * dE(I), cW * dW(I))
var peronaMalikFilter = function(I, iter, K, method) {
    var dxW = ee.Kernel.fixed(3, 3,
                           [[ 0,  0,  0],
                            [ 1, -1,  0],
                            [ 0,  0,  0]]);
  
  var dxE = ee.Kernel.fixed(3, 3,
                           [[ 0,  0,  0],
                            [ 0, -1,  1],
                            [ 0,  0,  0]]);
  
  var dyN = ee.Kernel.fixed(3, 3,
                           [[ 0,  1,  0],
                            [ 0, -1,  0],
                            [ 0,  0,  0]]);
  
  var dyS = ee.Kernel.fixed(3, 3,
                           [[ 0,  0,  0],
                            [ 0, -1,  0],
                            [ 0,  1,  0]]);

  var lambda = 0.2;

  if(method == 1) {
    var k1 = ee.Image(-1.0/K);

    for(var i = 0; i < iter; i++) {
      var dI_W = I.convolve(dxW)
      var dI_E = I.convolve(dxE)
      var dI_N = I.convolve(dyN)
      var dI_S = I.convolve(dyS)
      
      var cW = dI_W.multiply(dI_W).multiply(k1).exp();
      var cE = dI_E.multiply(dI_E).multiply(k1).exp();
      var cN = dI_N.multiply(dI_N).multiply(k1).exp();
      var cS = dI_S.multiply(dI_S).multiply(k1).exp();
  
      I = I.add(ee.Image(lambda).multiply(cN.multiply(dI_N).add(cS.multiply(dI_S)).add(cE.multiply(dI_E)).add(cW.multiply(dI_W))))
    }
  }
  else if(method == 2) {
    var k2 = ee.Image(K).multiply(ee.Image(K));

    for(var i = 0; i < iter; i++) {
      var dI_W = I.convolve(dxW)
      var dI_E = I.convolve(dxE)
      var dI_N = I.convolve(dyN)
      var dI_S = I.convolve(dyS)
      
      var cW = ee.Image(1.0).divide(ee.Image(1.0).add(dI_W.multiply(dI_W).divide(k2)));
      var cE = ee.Image(1.0).divide(ee.Image(1.0).add(dI_E.multiply(dI_E).divide(k2)));
      var cN = ee.Image(1.0).divide(ee.Image(1.0).add(dI_N.multiply(dI_N).divide(k2)));
      var cS = ee.Image(1.0).divide(ee.Image(1.0).add(dI_S.multiply(dI_S).divide(k2)));
  
      I = I.add(ee.Image(lambda).multiply(cN.multiply(dI_N).add(cS.multiply(dI_S)).add(cE.multiply(dI_E)).add(cW.multiply(dI_W))))
    }
  }
  
  return I;
}


var basins_au = [
  null, // 0
  null, // 1
  ee.FeatureCollection('ft:1Dq_Q2JvvYkYO-kFX7L4E4Nzycwc50j9hfhSsBQJW'), // 2
  ee.FeatureCollection('ft:1778IyIZLZKSKVgko9X3aIV94E7jcm28uniyD6ycp'), // 3
  ee.FeatureCollection('ft:1WZ4Utbbatdl3vFVK7kTmAyHDyRjhMVfXeJeJTnBa'), // 4
  ee.FeatureCollection('ft:1rrk-yEOb8ILSolV_kSVD1qGxszHcy0cSL9UnUxIh'), // 5
  ee.FeatureCollection('ft:1-aMEhsi4usdxVUSSjKkJGC8pir3duCi_5oItnxtT'), // 6
  ee.FeatureCollection('ft:1YDeXF2LN8gDeJAOJTX0Kwp9QwV_-ZFI2llKilTGu'), // 7
  ee.FeatureCollection('ft:1YQ1qpXis4Z9z0NvKLdz-FjxFP5q2_fABi6aNSFn0') // 8
];

var basins_sa = [
  null, // 0
  null, // 1               
  ee.FeatureCollection('ft:1jVWsPL91fcIoLyNXE0DNEGrJPclOwbD2MTrwP2ve'), // 2
  ee.FeatureCollection('ft:1lPvvAHlPQzuRtkTacFn3m7E0eBCn8kuiZOe2Liki'), // 3
  ee.FeatureCollection('ft:1Mn2m-jL9GAlOtgr3AcdSjto4PbJFr255tbbnKiv7'), // 4
  ee.FeatureCollection('ft:15BO9yk6N1eVROwd1vZpM8buGIqnd1mLEffWgJzXo'), // 5
  ee.FeatureCollection('ft:1bW8vRJNTTPQaH3PGnDCVUvSPV4i1Z_KGMhAqwcSa'), // 6
  ee.FeatureCollection('ft:') // 7
];


// Murray & Darling
//var id = 5030073410; 
//var aoi_features = basins_au[3];

// Murray & Darling (basin near Cambera)
//var aoi_features = basins_au[5];
//var id = 5050597410;

// Murray & Darling (smaller basin near Cambera)
var aoi_features = basins_au[7];
var id = 5070596920;

// largerst basin of level 7
// var aoi_features = basins_au[7];
// var id = 5070087890;

//var aoi_features = basins_au[5];
// var id = 5050595240;

//var aoi_features = basins_au[8];
//var id = 5080596920;
//var id = 5080598860;
//var id = 5080598830;
//var id = 5080599330;
//var id = 5080599380;
//var id = 5080599390;

var image_name = 'SRTM_30_Murray_Darling_' + id;


var aoi = aoi_features.filter(ee.Filter.eq('HYBAS_ID', id));
var not_aoi = aoi_features.filter(ee.Filter.neq('HYBAS_ID', id));

if(buffer_size !== 0 || accuracy > 450) {
  Map.addLayer(aoi, {}, 'aoi (original)');
  aoi = ee.FeatureCollection(ee.Feature(aoi.first()).simplify(accuracy).buffer(buffer_size, accuracy))
}

var aoiRegion = aoi.geometry(1e-2).bounds(1e-2).coordinates().getInfo()[0];
// print(aoiRegion)

var dem = ee.Image('USGS/SRTMGL1_003');
// var dem = ee.Image('CGIAR/SRTM90_V4').clip(aoi);
// var dem = ee.Image('WWF/HydroSHEDS/03CONDEM').clip(aoi);
// var dem = ee.Image('WWF/HydroSHEDS/03VFDEM').clip(aoi);

// aoi = dem.clip(aoi).mask().focal_max({radius:1000, units:'meters'})
//aoi = aoi.mask(aoi)
Map.addLayer(aoi, {}, 'aoi (buffer)');

var multiplier = 50.0;
if(smoothen) {
  dem = peronaMalikFilter(dem.multiply(1/multiplier), 20, 0.02, 2).multiply(multiplier)
}

// see http://en.wikipedia.org/wiki/World_file
var crs_transform = [0.0002777777777777778, 0, -180.0001388888889, 0, -0.0002777777777777778, 60.00013888888889]// dem.getInfo().bands[0].crs_transform;
var crs = "EPSG:4326" // dem.getInfo().bands[0].crs;
var w = Math.round((aoiRegion[1][0] - aoiRegion[0][0])/-crs_transform[4]);
var h = Math.round((aoiRegion[2][1] - aoiRegion[1][1])/crs_transform[0]);

var x = aoiRegion[0][0];
var y = aoiRegion[0][1];

crs_transform = [crs_transform[0], crs_transform[1], x, crs_transform[3], crs_transform[0], y];

print(aoiRegion)

print(crs_transform)

var dimensions = w + 'x' + h;
print(dimensions)

// print(dem)

// burn observerd L8 water using distance transform
var LC8_BANDS = ['B1', 'B2',   'B3',    'B4',  'B5',  'B6',    'B7',    'B8'];
var LC7_BANDS = ['B1', 'B1',   'B2',    'B3',  'B4',  'B5',    'B7',    'B8'];
var STD_NAMES = ['deepblue', 'blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pan'];

// get all LANDSAT8 images
var images = ee.ImageCollection('LANDSAT/LC8_L1T_TOA')
   .filterBounds(aoi)
  //.filterBounds(Map.getBounds(true))
  //.filterDate('2014-05-01', '2015-11-11')
  .select(LC8_BANDS, STD_NAMES);

var images_sng = images.select(['swir2', 'nir', 'green', 'pan', 'red', 'blue', 'swir1']);

var add_water = function(p) {
  var image_sng = images_sng.reduce(ee.Reducer.intervalMean(water_percentile, water_percentile+1));
  
  var ndwi = image_sng.normalizedDifference(ndwi_bands);

  // add NDWI > 0.0
  var water = ndwi.gt(ndwi_threshold);
  
  // select large blobs using morphological closing
  var water_closed = water.focal_max(90, 'circle', 'meters').focal_min(90, 'circle', 'meters');
  water_closed = water_closed.mask(water_closed)

  var water_small = water.multiply(water_closed)
  
  // burn using distance transform
  var distance = water.not().distance(ee.Kernel.euclidean(1000, "meters")).int().multiply(-0.1)
  
  var burned = dem.add(distance)

  return burned;
}  
   
if(burn_water) {
  dem = add_water(20)
}

var maskAndFill = function(image, aoi) {
  var mask = ee.Image(0).byte().paint(aoi, 1);
  var fill = mask.not().multiply(-9999);

  var result = image.multiply(mask);
  //result = result.add(fill);
  return result;
}

//var image = dem
var image = maskAndFill(dem, aoi);

/*
Export.image(image, image_name, 
{ 
  driveFileNamePrefix: image_name, 
  //format: 'tif', 
  crs: crs, 
  //crs_transform: JSON.stringify(crs_transform), 
  dimensions:dimensions, 
  region: aoiRegion,
  maxPixels:5e9
});
*/

var url = image.getDownloadURL({
  scale: 30,
  crs: crs,
  region: JSON.stringify(aoiRegion),
});

print(url)
