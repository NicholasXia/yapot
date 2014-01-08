//微信Account
if(!global.db){
	require('../MongoConnect');
}
var Schema = require('mongoose').Schema;
var webconfig=require('../../config/website');
var wxAccountSchema = Schema({ 
	accountId:String, //账号ID
	name:String,//公众账号名称
	wxid:String,//微信原始ID
	wxhao:String,//微信号
	type:Number,//公众账号类型 1，订阅号，2，服务号
	reg_date:Date,//注册时间
	app:{
		appid:String,//服务号ID
		secret:String,//服务号密码
		token:String //服务号访问凭证
	},
	token:Number,//验证开发模式TOKEN
	status:Number
});
// db is global
wxAccountSchema.virtual('viewType').get(function(){
	if(this.type==1){
		return '订阅号';
	}
	return '服务号';
});
wxAccountSchema.virtual('viewUrl').get(function(){
	
	return webconfig.domain+"/wx/api/"+this.id;
});
module.exports = db.model('wx_account', wxAccountSchema);
