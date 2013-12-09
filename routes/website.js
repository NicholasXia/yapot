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
	console.log(req.params.website);
	websiteService.findByEnglishName(req.params.website,function(err,website){
		if(website==null){
			res.send('没有发现网站');
		}else{
			channelService.findAllByWebsiteId(website.id,function(err,channels){
				var menus=[];
				menus.push({'name':'首页','link':'/u/'+website.english_name});
				for(var i=0;i<channels.length;i++){
					var menu={};
					menu.name=channels[i].name;
					menu.link='/u/'+website.english_name+'/'+channels[i].englishname;
					menus.push(menu);
				}
				
				nodeService.find(0,websiteConfig.PER_PAGE_NUM,function(err,articles){
					
					res.render('mobile/index', { menus:menus,articles:articles});
				});
				
			});
			
		}
		//res.send('hha');
	});
	
}
