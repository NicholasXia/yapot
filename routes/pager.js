var pagerService= require('../service/PagerService');
exports.details=function(req,res){
	var website=req.session.website;
	var renderArticle='users/'+website.account_id+'/pager';
	console.log('req.params.id '+req.params.id);
	pagerService.findById(req.params.id,function(err,pager){
		if(pager){
			return res.render(renderArticle,{menus:req.session.menus,pager:pager,website:req.session.website});
		}
		return res.send("没有找到文章");
	});
}