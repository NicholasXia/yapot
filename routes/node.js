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
		var pageParam={	
		};
		pageParam.iDisplayStart=req.query.start;
		pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;
		nodeService.findByWebsiteId(req.query.websiteId,pageParam,function(err,docs){
			
			return res.json(docs);
		});
		// nodeService.find(req.query.start,websiteConfig.PER_PAGE_NUM,function(err,docs){
		// 	res.json(docs);
		// });
	}
	
}

exports.details=function(req,res){
	var websiteName=req.params.website;
	var channelName=req.params.channel;
	var nodeId=req.params.id;
	var website=req.session.website;
	var renderArticle='users/'+website.account_id+'/article';
	var renderVideo='users/'+website.account_id+'/video';
	nodeService.findById(nodeId,function(err,node){
		
		if(node==null){
			res.send('没有发现网站');
		}else{
			if(node.article.title!=null){
				res.render(renderArticle,{menus:req.session.menus,node:node,website:req.session.website});
			}
			else if(node.video.title!=null){
				res.render(renderVideo,{menus:req.session.menus,node:node,website:req.session.website});
			}
		}
	});
}

