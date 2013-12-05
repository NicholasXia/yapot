var menuService=require('../../service/MenuService');
var _=require('underscore');
exports.index=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.menuActive='active';
	_.extend(pageRender,pageRender);
	res.render('cms/menu',pageRender);
}

exports.ajGetTree=function(req,res){
	menuService.findAllTree(function(tree){
		res.json(tree);
	});
}

exports.addParent=function(req,res){
	menuService.addParent(function(){
		
	})
}