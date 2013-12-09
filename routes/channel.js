var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var channelService=require('../service/ChannelService');
var websiteConfig=require('../config/website');
// exports.index=function(req,res){
// 	// res.send('model='+req.params.channel);
// 	channelService.findByEnglishname(req.params.channel,function(err,channel){
// 		if(channel==null){
// 			res.send('没有发现网站');
// 		}else{
// 			menuService.findAll(function(err,menus){
// 				nodeService.find(0,websiteConfig.PER_PAGE_NUM,function(err,articles){
// 					res.render('mobile/blog',{ menus:menus,articles:articles,channel:channel});
// 				});
				
// 			});
			
// 		}
// 		//res.send('hha');
// 	});
// }

exports.index=function(req,res){
	// res.send('model='+req.params.channel);
	var englishname=req.params.website;
	channelService.findByEnglishname(req.params.channel,function(err,channel){
		if(channel==null){
			return res.send('没有找到该频道');
		}else{
			var pageParam={	
			};
			pageParam.iDisplayStart=0;
			pageParam.iDisplayLength=websiteConfig.PER_PAGE_NUM;
			nodeService.findByChannelId(channel.id,pageParam,function(err,articles){
				return res.render('mobile/blog',{ menus:req.session.menus,articles:articles,channel:channel,website:req.session.website});
			});			
		}

	});
}