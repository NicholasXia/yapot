if(!global.db){
	require('./MongoConnect');
}
/*
赞 明细表
*/
var Schema = require('mongoose').Schema;
var goodSchema = Schema({ 
	website_id:String,//网站ID
	channel_id:String,//频道ID
	node_id:String,//文章ID
	user_random_id:Number, //随机用户信息
	create_date:Date
});

// db is global
module.exports = db.model('good', goodSchema);
