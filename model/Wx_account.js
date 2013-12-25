//微信Account
if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var wxAccountSchema = Schema({ 
	email: String,//登录邮箱
	name:String,//用户名
	password:String,//密码
	reg_date:Date,//注册邮箱
	exp_date:Date,//过期时间
	role:Number,//角色
	status:Number
});
accountSchema.index({wxAccountSchema:1},{unique:true}); 