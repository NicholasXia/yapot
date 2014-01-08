//微信Account
if(!global.db){
	require('../MongoConnect');
}
var Schema = require('mongoose').Schema;
var webconfig=require('../../config/website');
var wxReplyFollowSchema = Schema({ 
	wxid:String,//微信账号ID
	type:Number,//被关注回复类型 1，文字 ，2，图文
	word:{
		content:String
	}
});

module.exports = db.model('wx_reply_follow', wxReplyFollowSchema);
