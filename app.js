var express = require('express'),
    mongoose = require('mongoose'),
	// model = require('./model'),
	// Activity = model.Activity,
	// User = model.User,
	// Record = model.Record,
	Activity = require('./model/activities'),
	User = require('./model/users'),
	Record = require('./model/records'),
	bodyParser = require('body-parser'),
    multer = require('multer'),
    fs = require('fs'),
    API = require('wechat-api');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data;
app.use(express.static(__dirname + '/upload/'));

var server = app.listen(3000, function () {
  console.log('linstening on port 3000');
});


var wechat = require('wechat');
var config = {
  token: 'mars',
  appid: 'wx9fb1b4868ad65f02',
  encodingAESKey: '49d925d6b41a6fefc32545325d4d98ee5d4d98ee8ee',
  appsecret:'49d925d6b41a6fefc32545325d4d98ee'
};
var api = new API(config.appid, config.appsecret);

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
	// 微信输入信息都在req.weixin上
	var message = req.weixin;
	// 验证签名，由于测试号有缺陷，先这样
	if(message.signature) {
	console.log('signature'+query.signature);
	res.send(message.echostr);
	};
	console.log(message)
	if (message.MsgType=='text'&& message.Content=='1') {
		var callback = function (res, message) {
			return function (err, user) {
				console.log('user');
				console.log(user);
				User.findOne({
					openId: user.openid,
					headimgUrl: user.headimgurl,
					nickName: user.nickname
				}, function (err, user) {
					record = new Record({_userId: user._id});
					record.save();
					user.records.push(record);
					user.save();
					var callback = function (record) {
						return function (err, activity) {
							activity.records.push(record);
							activity.save();
						}
					}
					Activity.findOne({id:message.Content}, callback(record))
				});
			}
		};
		api.getUser(message.FromUserName, callback(res, message));
		res.reply([
		{
			title: '报名成功',
			description: '报名成功',
			picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
			url: 'http://nodeapi.cloudfoundry.com/'
		}
		]);
	};
}));


var dbCallback = function (res, callback) {
	return function (err ,data){
		if (err) {
			console.error(err);
			res.json(jsonFail(1));
		} else{
	    	console.log('db sucess');
	    	if (callback) {
	    		console.log('callback')
	    		callback(data, res)
	    	}else {
				res.json(jsonSuccess(data));
	    	}	
		};
	}
};

var jsonSuccess = function (data) {
	return {
		retCode: 0,
		message: '',
		item: data
	};
};
var jsonFail = function (retCode) {
	var map = {
		1: 'service fail'
	};
	return {
		retCode: retCode || 1,
		message: map[retCode] || map[1]
	};
};

app.use(function (req, res, next) {
	console.log('req.params')
	delete req.body._id;
	console.log(req.params)
	console.log(req.body)
	console.log(req.query)
	console.log(req.headers['content-type'])
	console.log(req.method)
	next();
});
app.use('/activities/:_id', function (req, res) {
	// get, findOne
	if (req.method == 'GET') {
		var callback = function (data,res) {
			var records = data.records;
			var users = [];
			for(i in records) {
				users.push(records._userId);
			};
			data = {
				activity:data,
				users:users
			};
			console.log('data')
			console.log(data)
			res.json(jsonSuccess(data));
		};
		Activity.findOne(req.params, dbCallback(res, callback));
	} else if(req.method == 'POST'){
		Activity.update(req.params, dbCallback(res));
	}else{
		//
	}
});
app.use('/activities/', function (req, res) {
	if (req.method == 'GET') {
		Activity.find(dbCallback(res));
	} else if(req.method == 'POST'){
		var params = req.body;
		if (params.img !== undefined) {
			var activity = new Activity(req.params);

			var options = {filename: activity._Id};
			var imageDataBuffer = new Buffer(params.imgData.replace(/^data:image\/\w+;base64,/, ""), 'base64'); 
		    fs.writeFile('/bowen/aifen/img'+options.filename, imageDataBuffer, function(err) {
		        if(err){
		          	res.send(jsonFail(1));
		        }else{
		        	activity.imgUrl = 'http://119.29.99.36'+'/img/'+options.filename;
		        	activity.save(dbCallback(res));
		        }
		    });
		}else {
			Activity.create(req.params, dbCallback(res))
		}
	}
});

app.use('/records/:_id', function (req, res) {
	if (req.method == 'GET') {
		Record.findOne(req.params, dbCallback(res));
	}else if(req.method == 'POST'){
		Record.update(req.params, req.params, dbCallback(res));
	};
});
app.use('/records/', function (req, res) {
	if (req.method == 'GET') {
		Record.find(dbCallback(res));
	} else if(req.method == 'POST'){
		var params = req.body;
		Activity.findOne({_id:params._activityId}, function (err, data) {
			if (err || data === null) {
				res.send(jsonFail(1));
			}else {
				record = new Record(params.record);
				record.save();
				var callback = function (err, data) {
					data.records.push(record);
					data.save();
				}
				User.findOne({_id: params._userId}, callback)
				data.records.push(record);
				data.save(dbCallback(res));
			}
		});
	}
})

app.use('/users/:_id', function (req, res) {
	if (req.method == 'GET') {
		User.findOne(req.params, dbCallback(res));
	}else if(req.method == 'POST'){
		User.update(req.params, req.params, dbCallback(res));
	}
});
app.use('/users/', function (req, res) {
	if (req.method == 'GET') {
		User.find(dbCallback(res));
	} else if(req.method == 'POST'){
		User.create(req.params, dbCallback(res));
	}
})
