var pagerDao=require('../model/Pager');
var websiteService=require('./WebsiteService');
exports.findAllTreeByWebsiteId=function(websiteId,cb){
	pagerDao.find({website_id:websiteId},function(err,docs){
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

exports.findByWebsiteId=function(websiteId,cb){
	pagerDao.find({website_id:websiteId},cb);
}

exports.add=function(websiteId,pager,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	console.log("websiteId "+websiteId);
	websiteService.findById(websiteId,function(err,website){
		pagerDao.create({
			website_id:websiteId,
			website_name:website.name,
			website_english_name:website.english_name,
			name:pager.name,
			content:pager.content
		},cbSave);
	});
}

exports.delete=function(id,cb){
	pagerDao.remove({"_id":id},cb);
}

exports.findById=function(id,cb){
	pagerDao.findOne({"_id":id},cb);
}

exports.update=function(id,pager,cb){
	pagerDao.update({"_id":id},{$set:pager},{ multi: false },cb);
}
exports.findByIds=function(ids,cb){
	pagerDao.find
	({"_id":{"$in":ids}},cb);
}
// exports.findAllTreeByWebsiteId('12123123',function(tree){
// 		console.log(tree);
// });