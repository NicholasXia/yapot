var websiteService=require('./WebsiteService');
var channelService=require('./ChannelService');
var menuService=require('./MenuService');
/**
Helper Service
*/

exports.initUser=function(req,res,next){
	var session=req.session;
	var cookies=req.cookies;
	//随机用户登录
	if(!cookies.userRandomId){
		res.cookie('userRandomId', Math.random(), { expires: new Date(Date.now() + 365*24*60*60*1000), httpOnly: true });
	}
	
	// if(!req.session.website&&req.params.website!=req.session.website.english_name){
	    var websiteEnglishName=req.params.website;
	    websiteService.findByEnglishName(req.params.website,function(err,website){

	      console.log('website ='+website);
	      if(!website){
	        return res.send('没有发现网站111');
	      }
	      website.url="http://"+req.host+"/u/"+website.english_name;
	      req.session.website=website;
	      // channelService.findAllByWebsiteId(website.id,function(err,channels){
	      //   var menus=[];
	      //   menus.push({'name':'首页','link':'/u/'+website.english_name});
	      //   for(var i=0;i<channels.length;i++){
	      //     var menu={};
	      //     menu.name=channels[i].name;
	      //     menu.link='/u/'+website.english_name+'/'+channels[i].englishname;
	      //     menus.push(menu);
	      //   }
	      //   req.session.menus=menus;
	      //   return next();
	      // });
	      menuService.findByWebsiteId(website.id,function(err,menus){
	      	var menusAry=[];
	        menusAry.push({'name':'首页','link':'/u/'+website.english_name,'icon':'fa fa-home'});
	        for(var i=0;i<menus.length;i++){
	          var menu={};
	          menu.name=menus[i].name;
	          menu.link=menus[i].link;
	          menu.icon=menus[i].icon;
	          menusAry.push(menu);
	        }
	        req.session.menus=menusAry;
	        return next();
	      });
	    });
  	// }else{
  		// return next();
  	// }
  	
	
}