var path = require('path');
var fs = require('fs');

var closureBasePath = path.join(__dirname, '/ext/closure-library/closure/goog' + path.sep);
var goog = require('closure').Closure({CLOSURE_BASE_PATH: closureBasePath});

var google = require('googleapis');
goog.require('goog.Uri');

goog.provide('gee');
goog.provide('gee.initialize');

// constants
var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var AUTH_FILE = path.join(__dirname, 'config/authinfo.json');
var REFRESH_TOKEN_FILE = HOME + '/.config/earthengine/credentials';

initialize = function (onsuccess) {
    var o = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
    var client = new google.auth.OAuth2(o.client_id, o.client_secret, o.redirect_uri);

    function init() {
        var o2 = JSON.parse(fs.readFileSync(REFRESH_TOKEN_FILE, 'utf8'));
        client.setCredentials({refresh_token: o2.refresh_token});

        client.refreshAccessToken(function (err, tokens) {
            ee.data.authToken_ = 'Bearer ' + tokens['access_token'];
            ee.data.authClientId_ = o.cliet_id;
            ee.data.authScopes_ = [ee.data.AUTH_SCOPE_];
            ee.data.DEFAULT_API_BASE_URL_ = "https://earthengine.googleapis.com/api";
            ee.initialize(ee.data.DEFAULT_API_BASE_URL_);

            onsuccess();
        });
    }

    // check if refresh token exists
    var isEmptyRefreshToken = true;
    if(fs.existsSync(REFRESH_TOKEN_FILE)) {
        console.log('file exists')
        var o2 = JSON.parse(fs.readFileSync(REFRESH_TOKEN_FILE, 'utf8'));
        if('refresh_token' in Object.keys(o2)) {
            console.log('key exists')
            isEmptyRefreshToken = false;
        }
    }

    // generate refresh token
    if (isEmptyRefreshToken) {
        var toQueryData = function (params) {
            var queryData = new goog.Uri.QueryData();
            for (var item in params) {
                queryData.set(item, params[item]);
            }
            return queryData;
        };

        var params = {
            'scope': 'https://www.googleapis.com/auth/earthengine.readonly',
            'redirect_uri': o.redirect_uri,
            'response_type': 'code',
            'client_id': o.client_id
        };

        var uri = 'https://accounts.google.com/o/oauth2/auth?' + toQueryData(params).toString();

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
            console.log('https://accounts.google.com/o/oauth2/token?' + toQueryData(params).toString());

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
