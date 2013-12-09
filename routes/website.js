var websiteService=require('../service/WebsiteService');
var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var channelService=require('../service/ChannelService');
var websiteConfig=require('../config/website');
// exports.index=function(req, res){
// 	console.log(req.params.website);
// 	websiteService.findByEnglishName(req.params.website,function(err,website){
// 		if(website==null){
// 			res.send('没有发现网站');
// 		}else{
// 			menuService.findAll(function(err,menus){
// 				nodeService.find(0,websiteConfig.PER_PAGE_NUM,function(err,articles){
// 					console.log(JSON.stringify(articles));
// 					res.render('mobile/index', { menus:menus,articles:articles});
// 				});
				
// 			});
			
// 		}
// 		//res.send('hha');
// 	});
	
// }
exports.index=function(req, res){
	var website=req.session.website;
	var pageParam={};
	pageParam.iDisplayStart=0;
	pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;
	nodeService.findByWebsiteId(website.id,pageParam,function(err,articles){
		return res.render('mobile/index', { menus:req.session.menus,articles:articles,website:req.session.website});
	});
	
}
