var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var websiteConfig=require('../config/website');
var channelService=require('../service/ChannelService');
exports.ajList=function(req,res){
	console.log(req.query.start);
	if(req.query.channelid){
		var pageParam={	
		};
		pageParam.iDisplayStart=req.query.start;
		pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;

		nodeService.findByChannelId(req.query.channelid,pageParam,function(err,articles){
			res.json(articles);
		});
	}else{
		nodeService.find(req.query.start,websiteConfig.PER_PAGE_NUM,function(err,docs){
			res.json(docs);
		});
	}
	
}

// exports.details=function(req,res){
// 	var websiteName=req.params.website;
// 	var channelName=req.params.channel;
// 	var nodeId=req.params.id;
// 	console.log(nodeId);
// 	nodeService.findById(nodeId,function(err,node){
// 		console.log(node.article.content);
// 		if(node==null){
// 			res.send('没有发现网站');
// 		}else{
// 			menuService.findAll(function(err,menus){
// 				console.log(node.article);
// 				console.log(node.video);
// 				if(node.article.title!=null){
// 					res.render('mobile/article',{menus:menus,node:node});
// 				}
// 				else if(node.video.title!=null){
// 					res.render('mobile/video',{menus:menus,node:node});
// 				}
// 		 });
// 		}
// 	});
// }

exports.details=function(req,res){
	var websiteName=req.params.website;
	var channelName=req.params.channel;
	var nodeId=req.params.id;
	
	nodeService.findById(nodeId,function(err,node){
	
		if(node==null){
			res.send('没有发现网站');
		}else{
			channelService.findAllByWebsiteId(node.website_id,function(err,channels){
				var menus=[];
				menus.push({'name':'首页','link':'/u/'+websiteName});
				for(var i=0;i<channels.length;i++){
					var menu={};
					menu.name=channels[i].name;
					menu.link='/u/'+websiteName+'/'+channels[i].englishname;
					menus.push(menu);
				}


				if(node.article.title!=null){
					res.render('mobile/article',{menus:menus,node:node});
				}
				else if(node.video.title!=null){
					res.render('mobile/video',{menus:menus,node:node});
				}
		 });
		}
	});
}

