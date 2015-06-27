var express = require('express');
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
  token: 'token',
  appid: 'appid',
  encodingAESKey: 'encodinAESKey'
};

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
}));
