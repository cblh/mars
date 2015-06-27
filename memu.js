var http = require('http'),
    querystring = require('querystring'),
    request = require('request'),
    needle = require('needle');

var menuData =  {
    "button":[
    {
        "type":"view",
        "name":"activities",
        "url":"http://www.soso.com/"
    }]
};
data = menuData;
var dataString = querystring.stringify(data);

var CONFIG = {
	appid: 'wx9fb1b4868ad65f02',
	appsecret:'49d925d6b41a6fefc32545325d4d98ee'
}
CONFIG.accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+CONFIG.appid+'&secret='+CONFIG.appsecret;
var tokenCallback = function (e, r, body) {
    console.log(body);
	console.log(JSON.parse(body).access_token);
    body = JSON.parse(body);
	var url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+body.access_token;
    // reqUrl(url, 'POST', data);
    request.post({url: url, form: data}, function (err, response, body) {
		console.log(body)
	})
}
request.get(CONFIG.accessTokenUrl, tokenCallback)

var headers = {
    // 'Content-Type': 'application/json',
    // 'Content-Length': dataString.length
};


// console.log(options.url);


function reqUrl (url, method, callback) {
    // Setup the request.  The options parameter is
    // the object we defined above.
    var options = {
        url: url,
        // path: '/activities/',
        method: method,
        // method: 'GET',
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
        });
    });

    req.on('error', function(e) {
        // TODO: handle error.
    });

    dataString = JSON.stringify(data)
    req.write(dataString);
    req.end();
}

