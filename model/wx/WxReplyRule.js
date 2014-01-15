//微信Account
if(!global.db){
	require('../MongoConnect');
}
var Schema = require('mongoose').Schema;
var webconfig=require('../../config/website');
var wxReplyRuleSchema = Schema({ 
	wxid:String,//微信账号ID
	name:String,//规则名称
	all:Boolean,//true 全部回复 false 随即回复
	keywords:[subKeyword],
	replies:[subReply],
	create_date:Date //创建时间
});
var subKeyword={
	name:String,
	match:Boolean//trun 全文匹配 false 精准匹配
}
var subReply={
	rtype:Number,//类型 1.文字 2.文章（单图文） 3.一组文章（多图文）4.频道 5.页面 6.一组页面
	word:{
		content:String
	},
	node:{
		node_id:String,
		title:String
	},
	gnode:{
		node:[
			{
				node_id:String,
				title:String
			}
		]	
	},
	channel:{
		name:String,
		channel_id:String,
		num:String
	},
	pages:{
		name:String,
		page_id:String
	},
	gpage:{
		page:[
			{
				name:String,
				page_id:String
			}
		]
	}	
	
}
wxReplyRuleSchema.virtual('viewKeywords').get(function(){
	var ks=[];
	for(var i=0;i<this.keywords.length;i++){
		ks.push(this.keywords[i].name);
	}
	console.log(ks.join(','));
	return ks.join(',');
});
wxReplyRuleSchema.set('toJSON', { virtuals: true });
module.exports = db.model('wx_reply_rule', wxReplyRuleSchema);
