var websiteService=require('../../service/WebsiteService');
exports.index=function(req,res){
	// console.log(req.user);
	websiteService.findByAccountId(req.user.id,function(err,website){
		req.session.website=website;
		res.render("cms/index",{user:req.user,indexActive:'active'});
	});
	
}
