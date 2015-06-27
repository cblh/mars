var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var Record = mongoose.model('Record', {
    // _activityId: mongoose.Types.ObjectId,
    // _userId: mongoose.Types.ObjectId,
    startTime: Date,//date,
    endTime: Date//date
});
module.exports = Record;