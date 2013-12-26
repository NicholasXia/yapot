var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var channelService=require('../service/ChannelService');
var websiteConfig=require('../config/website');


exports.index=function(req,res){
	// res.send('model='+req.params.channel);
	var englishname=req.params.website;
	var website=req.session.website;
	channelService.findByEnglishname(website.id,req.params.channel,function(err,channel){
		if(channel==null){
			return res.send('没有找到该频道');
		}else{
			var pageParam={	
			};
			var rendPage='users/'+website.account_id+'/'+website.tplname+'/category';
			pageParam.iDisplayStart=0;
			pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;
			nodeService.findByChannelId(channel.id,pageParam,function(err,articles){
				return res.render(rendPage,{ menus:req.session.menus,articles:articles,channel:channel,website:req.session.website});
			});			
		}

	});
}