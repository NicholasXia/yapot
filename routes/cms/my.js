var websiteService=require('../../service/WebsiteService');
var channelService=require('../../service/ChannelService');
var nodeService=require('../../service/NodeService');
var tplService=require('../../service/TplService');
exports.redirectIndex=function(req,res){
	if(req.user.role==0){
		res.redirect('/cms/admin/index');
	}
	else{
		res.redirect('/cms/index');
	}
}

exports.index=function(req,res){
	websiteService.findByAccountId(req.user.id,function(err,website){
		if(!website){
			return res.render("cms/init.ejs",{user:req.user});
		}
		req.session.website=website;
		console.log("website "+website);
		website.url="/u/"+website.english_name;
		return res.render("cms/index",{user:req.user,indexActive:'active',website:website});
	});	
}

exports.ajUpdate=function(req,res){
	var id= req.query.id;
	var website={
		name:req.query.website_name,
		imgurl:req.query.imgurl
	}
	websiteService.updateById(id,website,function(err){
		return res.json(err);
	});
}

//管理员首页
exports.indexAdmin=function(req,res){
	res.render("cms/admin/index",{user:req.user,indexActive:'active'});
}

exports.ajSaveInit=function(req,res){
	var webisite={
		account_id:req.user.id,
		name:req.body.website_name,
		english_name:req.body.website_english_name,
		imgurl:req.body.website_image,
		tplname:req.body.tplname,
		status:1
	};
	tplService.copyTplByNameAccount(req.body.tplname,webisite.account_id,function(err){
		websiteService.add(webisite,function(err,website){
			console.log("添加网站成功");
			channelService.addAndMenu(website.id,req.body.channel_name,req.body.channel_english_name,function(err,channel){
				console.log("添加菜单成功");
				nodeService.addArticle(website.id,
					channel.id,
					req.body.article_name,
					req.body.article_content,
					req.body.article_image,function(){
						console.log("初始化成功");
						return res.json({'success':1});
				});
			});
		});

	});

	
}




