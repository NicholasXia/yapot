var pagerService=require('../../service/PagerService');
exports.index=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.pagerActive='active';
	res.render("cms/pager",pageRender);
}

exports.ajGetTree=function(req,res){
	pagerService.findAllTreeByWebsiteId(req.session.website.id,function(tree){
		return res.json(tree);
	});
}

exports.ajAdd=function(req,res){
	pagerService.add(req.session.website.id,req.query,function(err,pager){
		return res.json(pager);
	});
}

exports.ajDelete=function(req,res){
	pagerService.delete(req.query.id,function(err,pager){
		return res.json(pager);
	});
}

exports.ajFindById=function(req,res){
	pagerService.findById(req.query.id,function(err,pager){
		return res.json(pager);
	});
}

exports.ajUpdate=function(req,res){

	pagerService.update(req.query.id,req.query,function(err,num){
		return res.json(num);
	});
}
