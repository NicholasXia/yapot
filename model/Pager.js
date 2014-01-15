if(!global.db){
	require('./MongoConnect');
}
var websiteConfig=require('../config/website');
var S=require('string');
var Schema = require('mongoose').Schema;
var pagerSchema = Schema({ 
	website_id:String,//网站ID
	website_name:String,//网站名
	website_english_name:String,//网站英文名
	name:String,//Page名称
	content:String,//Page内容
});


pagerSchema.virtual('wxTitle').get(function(){
	return S(this.name).left(websiteConfig.WX_TITLE).s;
});

pagerSchema.virtual('wxDes').get(function(){
	return S(this.name).left(websiteConfig.WX_DES).s;
});


pagerSchema.virtual('wxImg').get(function(){
	return '';
});

pagerSchema.virtual('wxUrl').get(function(){
	return websiteConfig.domain+"/u/"+this.website_english_name+"/p/"+this.id;
});
pagerSchema.set('toJSON', { virtuals: true });
// db is global
module.exports = db.model('pager', pagerSchema);
