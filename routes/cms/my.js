var websiteService=require('../../service/WebsiteService');
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
		return res.render("cms/index",{user:req.user,indexActive:'active'});
	});	
}
//管理员首页
exports.indexAdmin=function(req,res){
	res.render("cms/admin/index",{user:req.user,indexActive:'active'});
}




