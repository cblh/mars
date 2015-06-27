var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var User = mongoose.model('User', {
    type: Number,//0,1000，administrator
    unionId: Number,//绑定微信账号
    nationId: Number,//身份证，默认null
    records: Array//_recordId:Schema.Types.ObjectId,
});
module.exports = User;
