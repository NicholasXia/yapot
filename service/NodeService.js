var nodeDao=require('../model/Node');
var page=require('../model/Page');
var moment = require('moment');
var channelService = require('./ChannelService');
var websiteService = require('./WebsiteService');
var _=require('underscore');
var async=require('async');
exports.addArticle=function(websiteId,channelId,title,content,imgUrl,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	var node={article:{}};
	node.website_id=websiteId;
	websiteService.findById(websiteId,function(err,website){
		node.channel_id=channelId;
		node.website_name=website.name;
		node.website_english_name=website.english_name;
		channelService.findById(channelId,function(err,channel){
			node.channel_name=channel.name;
			node.channel_english_name=channel.englishname;
			node.article.title=title;
			node.article.content=content;
			node.article.img_url=imgUrl;
			node.create_date=new moment();
			node.status=nodeDao.ACTIVE;		
			nodeDao.create(node,cbSave);
		});
	});
}

exports.deleteNodeById=function(id,cb){
	nodeDao.remove({"_id":id},function(err){
		cb();
	});
}

exports.addVideo=function(websiteId,channelId,title,content,videoUrl,imgUrl,cb){
	function cbSave(err,data){
		cb(err,data);
	}
	var node={video:{}};
	node.website_id=websiteId;
	websiteService.findById(websiteId,function(err,website){
		node.channel_id=channelId;
		node.website_name=website.name;
		node.website_english_name=website.english_name;
		channelService.findById(channelId,function(err,channel){
			node.channel_name=channel.name;
			node.channel_english_name=channel.englishname;
			node.video.title=title;
			node.video.content=content;
			node.video.url=videoUrl;
			node.video.img_url=imgUrl;
			node.create_date=new moment();
			node.status=nodeDao.ACTIVE;
			nodeDao.create(node,cbSave);
		});
	});
}

exports.find=function(start,number,cb){
	var query = nodeDao.find({});
	var pageParam={	
	};
	pageParam.iDisplayStart=start;
	pageParam.iDisplayLength=number;
	page.pageQuery(query,pageParam,cb);
}

exports.findByWebsiteId=function(websiteId,pageParam,cb){
	pageParam.sort={'create_date':-1};
	console.log('website_id='+websiteId);
	page.pageQuery2(nodeDao,{website_id:websiteId},pageParam,cb);
}

exports.findByChannelId=function(channelId,pageParam,cb){
	pageParam.sort={'create_date':-1};
	page.pageQuery2(nodeDao,{channel_id:channelId},pageParam,cb);
}

exports.findById=function(id,cb){

	nodeDao.findOne({"_id":id},function(err,node){
		// node.viewCreateDate=moment(node.create_date).format("YYYY/MM/DD HH:mm 周d");
	
		cb(err,node);
	});
}

exports.updateByNodeId=function(nodeId,cb){
	nodeDao.update({"_id":nodeId},{$inc:{'analytics.good_num':1}},{ multi: true },cb);
}

exports.updateArticleById=function(nodeId,article,cb){
	nodeDao.update({"_id":nodeId},{$set:{'article':article}},{ multi: false },cb);
}

exports.updateVideoById=function(nodeId,video,cb){
	console.log("nodeid "+nodeId);
	nodeDao.update({"_id":nodeId},{$set:{'video':video}},{ multi: false },cb);
}

// var pageParam={	};
// pageParam.iDisplayStart=0;
// pageParam.iDisplayLength=10;
// exports.findByWebsiteId('52a56062bb55d65430000001',pageParam,function(err,data){console.log(data)});

// exports.updateByNodeId('529e917a9d30229837000001',function(err,numEffect){
// 	console.log(numEffect);
// });

// exports.addArticle('5296adddcd9b439c16000001','5296af90037faf0007000001'
// ,'13.12.7 广州 2013宫颈癌微创手术论坛'
// ,'各位妇产科同仁，大家好！我们将于2013年12月7日在广州南方医院举办“2013宫颈癌微创手术论坛”。论坛理论联系实际，从手术相关解剖的角度讲解手术技巧，邀请国内著名宫颈癌微创治疗手术专家就微创术式的某一部分进行详细的专题讲座。同时欢迎全国的妇产科医生就以下专题录制手术录像，参加会议交流（10分钟）。报名信息及录像请于2013年12月1日前报于秘书组。相关信息可见南方医科大学南方医院网站(www.nfyy.com) 的最新公告或教学天地栏和中国妇产科网(www.china-obgyn.net) 的会议通知栏内的详细通知。'
// ,'http://a.36krcnd.com/photo/35fdc7bc4214471f41dd8edabf534113.jpg'
// ,function(err,data){
// 	console.log(data);
// });

// exports.addVideo('5296adddcd9b439c16000001','5296af90037faf0007000001'
// ,'视频'
// ,'相当牛逼的视频'
// ,'http://localhost:3333/video/echo-hereweare.mp4'
// ,function(err,data){
// 	console.log(data);
// });

// exports.find(0,1,function(err,docs){
// 	console.log(docs.aaData[0]);
// });

// exports.findById('529f47aee11b506431000003',function(err,node){
// 	console.log(node.toJSON());
// });

// var a={haha:111}
// var b={c:222}
// _.extend(a,b);
// console.log(a);

// function updateUrl(node,cb){
// 	if(node.article.img_url.indexOf('undefined')!){
// 		console.log("删除 图片");
// 		nodeDao.update({"_id":node.id},{$set:{'article.img_url':null}},{ multi: false },cb);
// 	}else{
// 		var domain='http://weixin.china-obgyn.net/users'
// 		var newimgurl=domain+node.article.img_url.split('/users')[1];
// 		console.log(newimgurl);
// 		nodeDao.update({"_id":node.id},{$set:{'article.img_url':newimgurl}},{ multi: false },cb);
// 	}
	
// }

// nodeDao.find({},function(err,nodes){
// 	async.each(nodes,updateUrl,function(err){

// 	});
// });