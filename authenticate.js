var path = require('path');
var fs = require('fs');
var ee = require('@google/earthengine');
const {google} = require('googleapis');

// constants
var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var AUTH_FILE = path.join(__dirname, 'config/authinfo.json');
var REFRESH_TOKEN_FILE = HOME + '/.config/earthengine/credentials';

// constants
// var REFRESH_TOKEN_FILE = path.join(__dirname, 'config/refresh.json');

initialize = function (onsuccess, auth) {
    if(auth) {
      console.log('Resetting authentication ...')
      if (fs.existsSync(REFRESH_TOKEN_FILE)) {
        fs.unlinkSync(REFRESH_TOKEN_FILE);
      }
    }

    var o = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));

    const client = new google.auth.OAuth2(o.client_id, o.client_secret, o.redirect_uri);

    function init() {
        var o2 = JSON.parse(fs.readFileSync(REFRESH_TOKEN_FILE, 'utf8'));

        client.setCredentials({refresh_token: o2.refresh_token});

        client.refreshAccessToken(function (err, tokens) {
            ee.apiclient.setAuthToken('', 'Bearer', tokens['access_token'], 3600, [], undefined, false);

            ee.apiclient.setCloudApiEnabled(true);

            ee.initialize(null, null, () => {
                onsuccess();
            });
        });
    }

    // generate refresh token
    if (!fs.existsSync(REFRESH_TOKEN_FILE)) {
        var params = {
            'client_id': o.client_id,
            'scope': 'https://www.googleapis.com/auth/earthengine https://www.googleapis.com/auth/devstorage.full_control',
            'redirect_uri': o.redirect_uri,
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
                'client_id': o.client_id,
                'client_secret': o.client_secret,
                'redirect_uri': o.redirect_uri,
                'grant_type': 'authorization_code'
            };

            console.log('https://accounts.google.com/o/oauth2/token?' + querystring.stringify(params));

            var refresh_token = null;
            var request = require('request');
            request.post('https://accounts.google.com/o/oauth2/token', {form: params}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                refresh_token = JSON.parse(body).refresh_token;

                require('mkdirp').sync(require('path').dirname(REFRESH_TOKEN_FILE));

                // write refresh_token to config file
                fs.writeFileSync(REFRESH_TOKEN_FILE, JSON.stringify({refresh_token: refresh_token}), 'utf8');

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
