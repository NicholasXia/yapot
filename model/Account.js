if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var accountSchema = Schema({ 
	email: String,//登录邮箱
	name:String,//用户名
	password:String,//密码
	reg_date:Date,//注册邮箱
	exp_date:Date,
	status:Number
});
accountSchema.index({email:1},{unique:true}); 

// db is global
module.exports = db.model('account', accountSchema);
module.exports.ACTIVE=1;
module.exports.DISABLE=0;