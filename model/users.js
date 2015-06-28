var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.createConnection('mongodb://localhost/test1');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var User = mongoose.model('User', Schema({
    type: Number,//0,100，administrator
    wechatName: String,
    openId: Number,//绑定微信账号
    nationId: Number,//身份证，默认null
    headimgUrl: String,
    nickName: String,
    // records: Array//_recordId:Schema.Types.ObjectId,
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    }]
}));
module.exports = User;
