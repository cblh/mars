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
  console.log('something in');
});
