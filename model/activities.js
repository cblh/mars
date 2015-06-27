var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection sucess');
});

var ActivityShema = {
    title:String,//活动标题
    desc:String,//活动描述字数限制？
    createTime:{type:Date, default: Date.now},
    actTime:Date,//活动时间
    signTime:Date,//报名截止时间
    position: String,//活动地点
    startPosition: { //开始位置
        lat:Number,
        lon:Number
    },
    endPosition: { //结束位置
        lat:Number,
        lon:Number
    },
    records: Array//_recordId:Schema.Types.ObjectId,

};

var Activity = mongoose.model('Activity', ActivityShema);
module.exports = Activity;



// var qexport = {
// 	create: function (params) {
// 		var Activity = mongoose.model('Activity', ActivityShema);
// 		var model = new Activity(params);
// 		model.save(dbCallback);
// 	},
// 	show: function (params) {
// 		var Activity = mongoose.model('Activity', params);
// 		Activity.findOne(function (err, doc) {
// 			return doc;
// 		})
// 	},
// 	update: function (params) {
// 		var Activity = mongoose.model('Activity', params);
// 		Activity.findOne(function (err, doc) {
// 			doc.
// 			doc.markModified(createTime,actTime,signTime,records);
// 		})
// 	},
// 	delete: function () {
// 	},
// 	all: function () {
// 	},
// };

// var params = {
// 	title: '187'
// }
// qexport.create(params);
