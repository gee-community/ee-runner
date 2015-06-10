// include closure
var path = require('path');
var closureBasePath = path.join(__dirname, '/ext/closure-library/closure/goog/');
var goog = require('closure').Closure({CLOSURE_BASE_PATH: closureBasePath});
require('./ext/closure-library/closure/goog/bootstrap/nodejs')

// include fixed version of XMLHttpRequest (supports sync calls)
global.XMLHttpRequest = require('./ext/xmlhttprequest-sync/lib/XMLHttpRequest').XMLHttpRequest;

// include GEE sources
require('./ext/earthengine-api/javascript/src/encodable')
require('./ext/earthengine-api/javascript/src/serializer')
require('./ext/earthengine-api/javascript/src/data')
require('./ext/earthengine-api/javascript/src/computedobject')
require('./ext/earthengine-api/javascript/src/types')
require('./ext/earthengine-api/javascript/src/function')
require('./ext/earthengine-api/javascript/src/apifunction')
require('./ext/earthengine-api/javascript/src/element')
require('./ext/earthengine-api/javascript/src/filter')
require('./ext/earthengine-api/javascript/src/collection')
require('./ext/earthengine-api/javascript/src/number')
require('./ext/earthengine-api/javascript/src/string')
require('./ext/earthengine-api/javascript/src/date')
require('./ext/earthengine-api/javascript/src/list')
require('./ext/earthengine-api/javascript/src/dictionary')
require('./ext/earthengine-api/javascript/src/geometry')
require('./ext/earthengine-api/javascript/src/feature')
require('./ext/earthengine-api/javascript/src/customfunction')
require('./ext/earthengine-api/javascript/src/featurecollection')
require('./ext/earthengine-api/javascript/src/image')
require('./ext/earthengine-api/javascript/src/imagecollection')
require('./ext/earthengine-api/javascript/src/terrain')
require('./ext/earthengine-api/javascript/src/ee')

// replacements used in playground code
global.print = function(arg) { console.log(arg); }
global.Map.addLayer = function(arg) {}
global.Map.addCenterObject = function(arg) {}

// setup Oauth2
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// read Oauth2 info
// var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
// var path = home + '/.config/earthengine/credentials';
var fs = require('fs')

var obj = JSON.parse(fs.readFileSync('config/authinfo.json', 'utf8'));

var CLIENT_ID = obj.client_id;
var CLIENT_SECRET = obj.client_secret;
var REDIRECT_URI = obj.redirect_uri;

var obj = JSON.parse(fs.readFileSync('config/refresh_token.json', 'utf8'));
var REFRESH_TOKEN = obj.refresh_token;
    
// authorize
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

oauth2Client.refreshAccessToken(function(err, tokens) {
  // your access_token is now refreshed and stored in oauth2Client
  // store these new tokens in a safe place (e.g. database)

  var ACCESS_TOKEN = tokens['access_token'];

  ee.data.authToken_ = 'Bearer ' + ACCESS_TOKEN;
  ee.data.authClientId_ = CLIENT_ID
  ee.data.authScopes_ = [ee.data.AUTH_SCOPE_]
  ee.data.DEFAULT_API_BASE_URL_ = "https://earthengine.googleapis.com/api"

  ee.initialize(ee.data.DEFAULT_API_BASE_URL_);

  require('./playground.js')
});