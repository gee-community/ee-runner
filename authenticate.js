var goog = require('closure').Closure({CLOSURE_BASE_PATH: 'ext\\closure-library\\closure\\goog\\'});
require('./ext/closure-library/closure/goog/bootstrap/nodejs')
goog.require('goog.Uri');

goog.provide('gee');
goog.provide('gee.initialize');

initialize = function(onsuccess) {
  var google = require('googleapis');
  var OAuth2 = google.auth.OAuth2;
  var fs = require('fs')

  var AUTH_FILE = 'config/authinfo.json';

  var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  var REFRESH_TOKEN_FILE = home + '/.config/earthengine/credentials';
  //var REFRESH_TOKEN_FILE = 'config/refresh_token.json';

  var o = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  var client = new OAuth2(o.client_id, o.client_secret, o.redirect_uri);

  // generate refresh token
  if (!fs.existsSync(REFRESH_TOKEN_FILE)) {
    var toQueryData = function(params) {
      var queryData = new goog.Uri.QueryData();
      for (var item in params) {
        queryData.set(item, params[item]);
      }
      return queryData;
    }

    var params = {
      'scope': 'https://www.googleapis.com/auth/earthengine.readonly',
      'redirect_uri': o.redirect_uri,
      'response_type': 'code',
      'client_id': o.client_id
    };

    var uri = 'https://accounts.google.com/o/oauth2/auth?' + toQueryData(params).toString()

    //goog.Uri.create('https', null, 'accounts.google.com', null, '/o/oauth2/auth', toQueryData(params));
    
    // open browser to get authorization code
    var opener = require('opener')
    opener(uri)

    // ask user to enter authorization code   
    var readline = require('readline-sync');
    var auth_code = readline.question('Please enter authorization code: ');

    console.log('Entered code: ' + auth_code);

    // request refresh token
    params = {
      'code': auth_code,
      'client_id': o.client_id,
      'client_secret': o.client_secret,
      'redirect_uri': o.redirect_uri,
      'grant_type': 'authorization_code'
    }
    console.log('https://accounts.google.com/o/oauth2/token?' + toQueryData(params).toString())

    var refresh_token = null;
    var request = require('request');
    request.post('https://accounts.google.com/o/oauth2/token', {form: params}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      refresh_token = JSON.parse(body).refresh_token;
    });

    // wait for results
    while(refresh_token == null) {
       require('deasync').sleep(100);
    }

    // write refresh_token to config file
    fs.writeFileSync(REFRESH_TOKEN_FILE, JSON.stringify({ refresh_token: refresh_token }), 'utf8');
  }

  var o2 = JSON.parse(fs.readFileSync(REFRESH_TOKEN_FILE, 'utf8'));
  client.setCredentials({refresh_token: o2.refresh_token});

  client.refreshAccessToken(function(err, tokens) {
    ee.data.authToken_ = 'Bearer ' + tokens['access_token'];
    ee.data.authClientId_ = o.cliet_id
    ee.data.authScopes_ = [ee.data.AUTH_SCOPE_]
    ee.data.DEFAULT_API_BASE_URL_ = "https://earthengine.googleapis.com/api"
    ee.initialize(ee.data.DEFAULT_API_BASE_URL_);

    onsuccess();
  });
}

module.exports.initialize = initialize

// initialize()