if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var menuSchema = Schema({ 
	website_id:String,//网站ID
	name:String,//'菜单名'
	parent_id:String,//'父菜单'
	link:String,//链接
	type:Number //类型	
});
menuSchema.index({parent_id:1}); 
menuSchema.virtual('viewType').get(function(){
	if(this.type==module.exports.LINK_CHANNEL){
		return "频道链接";
	}
	if(this.type==module.exports.LINK_PAGE){
		return "网页链接";
	}
	if(this.type==module.exports.LINK_APP){
		return "APP链接";
	}
	return "";
});
// db is global
module.exports = db.model('menu', menuSchema);
module.exports.LINK_TYPE=1;//频道链接
module.exports.LINK_PAGE=2;//网页链接
module.exports.LINK_APP=3;//APP链接