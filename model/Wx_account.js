//微信Account
if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var wxAccountSchema = Schema({ 
	name:String,//公众账号名称
	weixinhao:String,//微信号
	type:Number,//公众账号类型 1，订阅号，2，服务号
	reg_date:Date,//注册时间
	app:{
		appid:String,//服务号ID
		secret:String,//服务号密码
		token:String //服务号访问凭证
	}
	status:Number
});
