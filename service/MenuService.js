var menuDao=require('../model/Menu');
var moment = require('moment');
var channelService=require('./ChannelService');
exports.addParent=function(websiteId,name,link,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	menuDao.create({website_id:websiteId,name:name,link:link},cbSave);
}

exports.findById=function(id,cb){
	menuDao.findOne({"_id":id},cb);
}

exports.deleteParent=function(id,cb){
	menuDao.remove({"_id":id},cb);
}


exports.findAll=function(cb){
	menuDao.find({},function(err,docs){
		cb(err,docs);
	});
}

exports.findAllTree=function(cb){
	menuDao.find({},function(err,docs){
		var trees=[];
		for(var i=0;i<docs.length;i++){
			var menuTree={
				'data':'',
				'attr':{}
			};
			menuTree.data=docs[i].name;
			menuTree.attr.id=docs[i].id;
			trees.push(menuTree);
		}
		cb(trees);
	});
}

exports.findAllTreeByWebsiteId=function(websiteId,cb){
	menuDao.find({website_id:websiteId},function(err,docs){
		var trees=[];
		for(var i=0;i<docs.length;i++){
			var menuTree={
				'data':'',
				'attr':{}
			};
			menuTree.data=docs[i].name;
			menuTree.attr.id=docs[i].id;
			trees.push(menuTree);
		}
		cb(trees);
	});
}

exports.updateMenuById=function(id,name,link,type,cb){
	if(type==menuDao.LINK_CHANNEL){//频道链接
		channelService.findByEnglishname(link,function(err,channel){
			menuDao.update(
				{"_id":id},
				{ $set:{name:name,link:link,type:type}},
				{ multi: true },cb);
			});
	}else{
		cb();
	}
	
}

// //Test Code
// exports.addParent('首页','/u/fuchanke',function(err,data){
// 	console.log(data);
// });

// exports.findAll(function(){});