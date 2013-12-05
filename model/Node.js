if(!global.db){
	require('./MongoConnect');
}
var moment=require('moment');
var Schema = require('mongoose').Schema;
var S=require('string');
var websiteConfig=require('../config/website');

var nodeSchema = Schema({ 
	website_id:String,//网站ID
	website_name:String,//网站名
	website_english_name:String,//网站英文名
	channel_id:String,//频道ID
	channel_name:String,//频道名
	channel_english_name:String,//频道英文名
	create_date:Date,
	article:{
		title:String,
		content:String,
		img_url:String
	},
	video:{
		title:String,
		content:String,
		img_url:String,
		url:String
	},
	analytics:{
		good_num:Number//赞
	},
	status:Number //频道状态
});

nodeSchema.virtual('viewCreateDate').get(function(){
	return moment(this.create_date).format("YYYY/MM/DD HH:mm 周d");
});

nodeSchema.virtual('viewTitle').get(function(){
//	console.log("cc"+this.article);
	if(this.article.title){
		return this.article.title;
	}else{
		return this.video.title;
	}
	
});

nodeSchema.virtual('article.description').get(function(){
		
	if((this.article.content+"").length>140){
		return S(this.article.content).left(websiteConfig.DESCRIPTION_WORD_NUM).s+"...";
	}
	return this.article.content;
	
});

nodeSchema.virtual('video.description').get(function(){

	if((this.video.content+"").length>140){
		return S(this.video.content).left(websiteConfig.DESCRIPTION_WORD_NUM).s+"...";
	}
	return this.video.content;
});

nodeSchema.set('toJSON', { virtuals: true });
// db is global
module.exports = db.model('node', nodeSchema);
module.exports.ACTIVE=1;
module.exports.DISABLE=0;