var menuService=require('../../service/MenuService');
var _=require('underscore');
exports.index=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.menuActive='active';
	_.extend(pageRender,pageRender);
	return res.render('cms/menu',pageRender);
}

exports.ajGetTree=function(req,res){
	menuService.findAllTreeByWebsiteId(req.session.website.id,function(tree){
		return res.json(tree);
	});
}

exports.ajFindById=function(req,res){
	menuService.findById(req.query.id,function(err,menu){
		res.json(menu);
	});
}

exports.addParent=function(req,res){
	menuService.addParent(req.session.website.id,req.query.menu_name,req.query.link,function(err,menu){
		return res.json(menu);
	})
}

exports.deleteParent=function(req,res){
	menuService.deleteParent(req.query.id,function(err,menu){
		return res.json(menu);
	});
}

exports.ajUpdate=function(req,res){
	var id=req.query.id;
	var name=req.query.menu_name;
	var link=req.query.link;
	var type=req.query.link_type;
	console.log('link_type '+type);
	menuService.updateMenuById(id,name,link,type,function(err,num){
		if(err) return res.json(err);
		return res.json(num);
	});
}