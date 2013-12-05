if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var channelSchema = Schema({ 
	website_id:String,//网站ID
	website_name:String,//网站名
	website_english_name:String,//网站英文名
	name: String,//频道名
	englishname:String,//英文名
	status:Number //频道状态
});
channelSchema.index({name:1},{unique:true}); 
// db is global
module.exports = db.model('channel', channelSchema);
module.exports.ACTIVE=1;
module.exports.DISABLE=0;