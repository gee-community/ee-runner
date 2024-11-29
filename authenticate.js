var path = require('path');
var fs = require('fs');
var ee = require('@google/earthengine');
const {google} = require('googleapis');
const {opts} = require('commander');

// constants
var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var REFRESH_TOKEN_FILE = HOME + '/.config/earthengine/credentials';

initialize = function (onsuccess, auth, opt_project) {
  if(auth) {
    console.log('Resetting authentication ...')
    if (fs.existsSync(REFRESH_TOKEN_FILE)) {
      fs.unlinkSync(REFRESH_TOKEN_FILE);
    }
  }

  var o = JSON.parse(fs.readFileSync(REFRESH_TOKEN_FILE, 'utf8'));
  const clientId = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
  const clientSecret = "d-FL95Q19q7MQmFpd7hHD0Ty";
  const redirectUri = "urn:ietf:wg:oauth:2.0:oob";

  function init() {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({refresh_token: o.refresh_token});

    client.refreshAccessToken(function (err, tokens) {
      if(err) {
        console.error(err);
        throw new Error('Could not refresh access token');
      }

      ee.apiclient.setAuthToken('', 'Bearer', tokens['access_token'], 3600, [], undefined, false);

      // ee.apiclient.setCloudApiEnabled(true);

      let project = opt_project;
      if(typeof(project) === 'undefined') {
        if(typeof(o.project) === 'undefined') {
          throw new Error('Cloud Project not found, run earthengine authenticate command or provide project name using the -p | --project argument')
        } else {
          project = o.project;
        }
      }

      // opt_baseurl, opt_tileurl, opt_successCallback, opt_errorCallback, opt_xsrfToken, opt_project
      ee.initialize(null, null, () => {
        onsuccess();
      }, (err) => {
        console.error(err);
        throw new Error('Could not initialize EE');
      }, null, project);
    });
  }

  // generate refresh token
  if (!fs.existsSync(REFRESH_TOKEN_FILE)) {
    var params = {
      'client_id': clientId,
      'scope': 'https://www.googleapis.com/auth/earthengine https://www.googleapis.com/auth/devstorage.full_control',
      'redirect_uri': redirectUri,
      'response_type': 'code'
    };

    var querystring = require('querystring');
    var uri = 'https://accounts.google.com/o/oauth2/auth?' + querystring.stringify(params);

    //goog.Uri.create('https', null, 'accounts.google.com', null, '/o/oauth2/auth', toQueryData(params));

    // open browser to get authorization code
    var opener = require('opener');
    opener(uri);

    console.log("If browser does not open, use the following URL to get access code:");
    console.log(uri);
    console.log();

    // ask user to enter authorization code
    console.log('Please enter authorization code: ');
    readKey(function (auth_code) {
      console.log('Entered code: ' + auth_code);

      // request refresh token
      params = {
        'code': auth_code,
        'client_id': clientId,
        'client_secret': clientSecret,
        'redirect_uri': redirectUri,
        'grant_type': 'authorization_code'
      };

      console.log('https://accounts.google.com/o/oauth2/token?' + querystring.stringify(params));

      var refresh_token = null;
      var request = require('request');
      request.post('https://accounts.google.com/o/oauth2/token', {form: params}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
          throw new Error('Could not refresh access token');
        }
        refresh_token = JSON.parse(body).refresh_token;

        require('mkdirp').sync(require('path').dirname(REFRESH_TOKEN_FILE));

        // write refresh_token to config file
        if(typeof(opt_project) === 'undefined') {
          throw new Error('Please specify project using -p | --project argument')
        }
        fs.writeFileSync(REFRESH_TOKEN_FILE, JSON.stringify({refresh_token: refresh_token, project: opt_project}), 'utf8');

        init();
      });
    });
  } else {
    init();
  }
};

function readKey(callback) {
  process.stdin.setEncoding('utf8');
  var key = '';

  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      callback(chunk);
    }
  });

  process.stdin.on('end', function () {
  });
}

module.exports.initialize = initialize;

// initialize()
