if(!global.db){
	require('./MongoConnect');
}
var Schema = require('mongoose').Schema;
var menuSchema = Schema({ 
	name:String,//'菜单名'
	parent_id:String,//'父菜单'
	link:String //链接
});
menuSchema.index({parent_id:1}); 
// db is global
module.exports = db.model('menu', menuSchema);
