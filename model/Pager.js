if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var pagerSchema = Schema({ 
	website_id:String,//网站ID
	website_name:String,//网站名
	website_english_name:String,//网站英文名
	name:String,//Page名称
	content:String,//Page内容
});
// db is global
module.exports = db.model('pager', pagerSchema);
