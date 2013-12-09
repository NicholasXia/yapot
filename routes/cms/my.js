var websiteService=require('../../service/WebsiteService');
var channelService=require('../../service/ChannelService');
var nodeService=require('../../service/NodeService');
exports.redirectIndex=function(req,res){
	if(req.user.role==0){
		res.redirect('/cms/admin/index');
	}
	else{
		res.redirect('/cms/index');
	}
}

exports.index=function(req,res){
	console.log("bull shit!!!! ");
	websiteService.findByAccountId(req.user.id,function(err,website){
		console.log("website "+website);
		if(!website){
			return res.render("cms/init.ejs",{user:req.user});
		}
		req.session.website=website;
		return res.render("cms/index",{user:req.user,indexActive:'active',website:website});
	});	
}
//管理员首页
exports.indexAdmin=function(req,res){
	res.render("cms/admin/index",{user:req.user,indexActive:'active'});
}

exports.ajSaveInit=function(req,res){
	var webisite={
		account_id:req.user.id,
		name:req.query.website_name,
		english_name:req.query.website_english_name,
		status:1
	};
	websiteService.add(webisite,function(err,website){
			channelService.add(website.id,req.query.channel_name,req.query.channel_english_name,function(err,channel){
				nodeService.addArticle(website.id,
					channel.id,
					req.query.article_name,
					req.query.article_content,
					req.query.article_image,function(){
						return res.json({'success':1});
				});
			});
	});
}




