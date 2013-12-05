var menuDao=require('../model/Menu');
var moment = require('moment');

exports.addParent=function(name,link,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	menuDao.create({name:name,link:link},cbSave);
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

// //Test Code
// exports.addParent('首页','/u/fuchanke',function(err,data){
// 	console.log(data);
// });

// exports.findAll(function(){});