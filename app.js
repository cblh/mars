var express = require('express'),
	Activity = require('./model/activities'),
	User = require('./model/users'),
	Record = require('./model/records');

var dbCallback = function (err) {
	if (err) {
		console.error.bind(console, 'connection error:');
  	}else {
    	console.log('save sucess');	
  	}
};

var app = express();

app.get('/app', function (req, res) {
  var query = req.query;
  if(query.signature) {
    console.log('signature'+query.signature);
    res.send(query.echostr);
  };
//  res.send('hello world');
});

var server = app.listen(3000, function () {
  console.log('linstening on port 3000');
});


var wechat = require('wechat');
var config = {
  token: 'mars',
  appid: 'wx9fb1b4868ad65f02',
  encodingAESKey: '49d925d6b41a6fefc32545325d4d98ee5d4d98ee8ee'
};

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  if(message.signature) {
    console.log('signature'+query.signature);
    res.send(message.echostr);
  };
}));
