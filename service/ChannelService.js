var channelDao=require('../model/Channel');
var moment = require('moment');
var websiteService=require('./WebsiteService');
exports.findAll=function(cb){
	channelDao.find({},cb);
}

exports.add=function(websiteId,name,englishname,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	websiteService.findById(websiteId,function(err,website){
		channelDao.create({
			website_id:websiteId,
			website_name:website.name,
			website_english_name:website.english_name,
			name:name,
			englishname:englishname,
			status:channelDao.ACTIVE
		},cbSave);
	});
	
}

exports.findById=function(channelId,cb){
	channelDao.findOne({"_id":channelId},cb);
}

exports.deleteById=function(channelId,cb){
	channelDao.remove({"_id":channelId},cb);
}

exports.findByEnglishname=function(englishname,cb){
	channelDao.findOne({"englishname":englishname},cb);
}

exports.findAllTree=function(websiteId,cb){
	channelDao.find({website_id:websiteId},function(err,channels){
		var channelTree=[];

		for(var i=0;i<channels.length;i++){
			var item={name:'',type:''};
			// var view={"english_name"};
			var strChannel=JSON.stringify(channels[i]);
			item.name=channels[i].name+"<info val='"+strChannel+"'><div class=\"tree-actions\"><i channelid='"+channels[i].id+"' class=\"fa fa-trash-o\"></i></div>";
			item.type='item';
			channelTree.push(item);
		}
		
		cb(err,channelTree);

	});
}

// exports.findAllTree('5296adddcd9b439c16000001',function(err,channels){
// 	console.log(channels);
// });
//Test Code
// exports.add('5296adddcd9b439c16000001','会议通知','meetings',function(err,data){
// 	console.log(data);
// });

// exports.findById("5296af90037faf0007000001",function(err,channel){
// 	console.log(channel);
// });