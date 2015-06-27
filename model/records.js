var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
mongoose.createConnection('mongodb://localhost/test1');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var Record = mongoose.model('Record', Schema({
    _activityId: {type:Schema.Types.ObjectId,ref:'Activity'},//活动外键,
    _userId: {type:Schema.Types.ObjectId,ref:'User'},//用户外键,
    startTime: Date,//date,
    endTime: Date//date
}));
module.exports = Record;