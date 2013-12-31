var pagerService=require('../../service/PagerService');
exports.index=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.pagerActive='active';
	pageRender.cmsActive='active';
	res.render("cms/pager",pageRender);
}

exports.ajGetTree=function(req,res){
	pagerService.findAllTreeByWebsiteId(req.session.website.id,function(tree){
		return res.json(tree);
	});
}

exports.ajAdd=function(req,res){
	pagerService.add(req.session.website.id,req.body,function(err,pager){
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

	pagerService.update(req.body.id,req.body,function(err,num){
		return res.json(num);
	});
}

exports.ajGetByWebsiteId=function(req,res){
	var websiteId=req.session.website.id;
	pagerService.findByWebsiteId(websiteId,function(err,pagers){
		return res.json(pagers);
	});
}
