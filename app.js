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
    os = require('os'),
    API = require('wechat-api');
var wechat = require('wechat');
var Event = require('wechat').Event;

var debug = true;
var CONFIG = {
    root: '/bowen/img/'
};
if (os.platform() === 'win32') {
    CONFIG.root = "E:/data/sites/";
};

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data;
app.use(express.static(__dirname + '/upload/'));

var server = app.listen(3000, function() {
    console.log('linstening on port 3000');
});


var config = {
    token: 'mars',
    appid: 'wx9fb1b4868ad65f02',
    encodingAESKey: '49d925d6b41a6fefc32545325d4d98ee5d4d98ee8ee',
    appsecret: '49d925d6b41a6fefc32545325d4d98ee'
};
var api = new API(config.appid, config.appsecret);

app.use(express.query());

var events = new Event();
events.add('subscribe', function (message, req, res, next) {
    // 订阅事件
    var callback = function(res, message) {
        return function(err, user) {
            User.create({
                openId: user.openid,
                headimgUrl: user.headimgurl,
                nickName: user.nickname
            });
        }
        };
    api.getUser(message.FromUserName, callback(res, message));
    res.reply('谢谢关注');
});
var handleEvent = Event.dispatch(events);

app.use('/wechat', wechat(config).text(handleText).event(handleEvent).middlewarify());

var handleText = function(message, req, res, next) {
    // 验证签名，由于测试号有缺陷，先这样
    if (message.signature) {
        console.log('signature' + query.signature);
        res.send(message.echostr);
    };
    console.log(message)
    if (message.MsgType == 'text' && message.Content == 'apply') {
        var callback = function(res, message) {
            return function(err, user) {
                console.log('user');
                console.log(user);
                User.findOne({
                    openId: user.openid,
                    headimgUrl: user.headimgurl,
                    nickName: user.nickname
                }, function(err, user) {
                    record = new Record({
                        _userId: user._id
                    });
                    record.save();
                    user.records.push(record);
                    user.save();
                    var callback = function(record) {
                        return function(err, activity) {
                            activity.records.push(record);
                            activity.save();
                        }
                    }
                    Activity.findOne({
                        id: message.Content
                    }, callback(record))
                });
            }
        };
        api.getUser(message.FromUserName, callback(res, message));
        res.reply([{
            title: '报名成功',
            description: '报名成功',
            picurl: activity.imgUrl,
            url: 'http://119.29.99.36/roam/html/apply-activity.html'
        }]);
        return;
    };
    if (message.MsgType == 'text' && message.Content == '1') {
        var string = '1<a href="http://119.29.99.36/roam/html/apply-activity.html">detail</a>/n';
        string += '/n2<a href="http://119.29.99.36/roam/html/check-activity.html">detail</a>/n';
        string += '/n3<a href="http://119.29.99.36/roam/html/share-page.html">detail</a>/n';
        string += '/n4<a href="http://119.29.99.36/roam/html/rank-list.html">detail</a>/n';
        res.reply(string);
        return;
    };
    if (message.MsgType == 'text' && message.Content == 'admin') {
        var string = 'admin<a href="http://119.29.99.36/aifen/admin/dist/html/edit.html">detail</a>'
        res.reply(string);
        return;
    };
    res.reply('等待客服回复');
};


var dbCallback = function(res, callback) {
    return function(err, data) {
        if (err) {
            console.error(err);
            res.json(jsonFail(1));
        } else {
            console.log('db sucess');
            if (callback) {
                console.log('callback')
                callback(data, res)
            } else {
                res.json(jsonSuccess(data));
            }
        };
    }
};

var jsonSuccess = function(data) {
    return {
        retCode: 0,
        message: '',
        item: data
    };
};
var jsonFail = function(retCode) {
    var map = {
        1: 'service fail'
    };
    return {
        retCode: retCode || 1,
        message: map[retCode] || map[1]
    };
};

app.use(function(req, res, next) {
    console.log('req.params')
    delete req.body._id;
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)
    console.log(req.headers['content-type'])
    console.log(req.method)
    next();
});
app.use('/activities/:_id', function(req, res) {
    // get, findOne
    if (req.method == 'GET') {
        var callback = function(data, res) {
            var records = data.records;
            var users = [];
            for (i in records) {
                users.push(records._userId);
            };
            data.users = users;
            console.log('data')
            console.log(data)
            var Temp = {
                "title":data.title,
                "desc":data.desc,
                "img":data.imgUrl,
                "startTime":data.startTime,
                "endTime":data.endTime,
                "position": data.position,
                "signPosition": data.signPosition,
                "list":[
                    {
                        "name": "蜡笔小新",
                        "avatar": "../img/wechat-1.jpg",
                        "totalhour": "214"
                    }
                ]
            }
            res.json(jsonSuccess(Temp));
        };
        Activity.findOne(req.params, dbCallback(res, callback));
    } else if (req.method == 'POST') {
        Activity.update(req.params, dbCallback(res));
    } else {
        //
    }
});
app.use('/activities/', function(req, res) {
    if (req.method == 'GET') {
        Activity.find(dbCallback(res));
    } else if (req.method == 'POST') {
        var params = req.body;
        if (params.img !== undefined) {
            var activity = new Activity(req.params);

            var options = {
                filename: Math.random().toString()
            };
            var imageDataBuffer = new Buffer(params.img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            var callback = function(activity) {
                return function(err) {
                    if (err) {
                        res.send(jsonFail(1));
                    } else {
                        params.imgUrl = 'http://119.29.99.36' + '/img/' + options.filename + '.jpg';
                        delete params.img;
                        var activity = Activity.create(params, function(err, doc){
                            var content = '活动报名<a href="http://119.29.99.36/roam/html/apply-activity.html?id='+doc._doc._id.toString()+'">链接</a>/n活动签到<a href="http://119.29.99.36/roam/html/check-activity.html?id='+doc._doc._id.toString()+'">链接</a>'

                            User.find({}, 'openId', function(err, data) {
                                receivers = data;
                                var receivers = [];
                                for (var i in data) {
                                    receivers.push(data[i].openId);
                                };
                                if (debug) {
                                    // 至少两个openid
                                    receivers = ['o21_5t6ZNO7xXKzikY4GGfLhdyFk','o21_5t6ZNO7xXKzikY4GGfLhdyFk'];
                                };
                                console.log(receivers);
                                api.massSendText(content, receivers, function(err) {
                                    if (!err) {
                                        console.log('send text');
                                    };
                                });
                            });
                            res.send(jsonSuccess());
                        });


                    }
                }
            };

            fs.writeFile(CONFIG.root + options.filename + '.jpg', imageDataBuffer, callback(activity));
        } else {
            Activity.create(req.params, dbCallback(res))
        }
    }
});

app.use('/records/:_id', function(req, res) {
    if (req.method == 'GET') {
        Record.findOne(req.params, dbCallback(res));
    } else if (req.method == 'POST') {
        Record.update(req.params, req.params, dbCallback(res));
    };
});
app.use('/records/', function(req, res) {
    if (req.method == 'GET') {
        Record.find(dbCallback(res));
    } else if (req.method == 'POST') {
        var params = req.body;
        Activity.findOne({
            _id: params._activityId
        }, function(err, data) {
            if (err || data === null) {
                res.send(jsonFail(1));
            } else {
                record = new Record(params.record);
                record.save();
                var callback = function(err, data) {
                    data.records.push(record);
                    data.save();
                }
                User.findOne({
                    _id: params._userId
                }, callback)
                data.records.push(record);
                data.save(dbCallback(res));
            }
        });
    }
})

app.use('/users/:_id', function(req, res) {
    if (req.method == 'GET') {
        User.findOne(req.params, dbCallback(res));
    } else if (req.method == 'POST') {
        User.update(req.params, req.params, dbCallback(res));
    }
});
app.use('/users/', function(req, res) {
    if (req.method == 'GET') {
        User.find(dbCallback(res));
    } else if (req.method == 'POST') {
        User.create(req.params, dbCallback(res));
    }
})

app.use('/rank/', function(req, res) {
    if (req.method !== 'GET') {
        req.setHead(404);
        return;
    };
    User.find()
        .record
})
