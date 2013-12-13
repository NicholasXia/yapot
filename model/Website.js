if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var websiteSchema = Schema({ 
	account_id:String,//账户ID
	name:String,//网站名称
	english_name:String,//网站地址域名
	des:String,//网站描述
	status:Number

});
websiteSchema.set('toJSON', { getters: true, virtuals: true });
// db is global
module.exports = db.model('website', websiteSchema);
module.exports.ACTIVE=1;
module.exports.DISABLE=0;