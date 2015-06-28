var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test1');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var ActivityShema = Schema({
    id: String,
    title:String,//活动标题
    desc:String,//活动描述
    createTime:{type:Date, default: Date.now},//创建时间
    actTime:String,//活动时间
    signTime:String,//报名截止时间
    startTime:String,
    endTime:String,
    position: String,//活动地点
    img:String,//
    imgUrl:String,//
    signPosition: { //开始位置
        lat:String,
        lon:String
    },
    // records: Array//_recordId:Schema.Types.ObjectId,
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    }]
});

var Activity = mongoose.model('Activity', ActivityShema);
module.exports = Activity;
