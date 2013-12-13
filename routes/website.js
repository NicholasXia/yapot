var websiteService=require('../service/WebsiteService');
var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var channelService=require('../service/ChannelService');
var websiteConfig=require('../config/website');

exports.index=function(req, res){
	var website=req.session.website;
	var pageParam={};
	var rendPage='users/'+website.account_id+'/index';
	pageParam.iDisplayStart=0;
	pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;
	nodeService.findByWebsiteId(website.id,pageParam,function(err,articles){
		return res.render(rendPage, { menus:req.session.menus,articles:articles,website:req.session.website});
	});
}
