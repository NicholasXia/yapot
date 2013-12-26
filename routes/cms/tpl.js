var tplService = require('../../service/TplService');
var _=require('underscore');
var websiteService = require('../../service/WebsiteService');
var renderObj={
	tplActive:'active'
}
exports.ajGetAll=function(req,res){
	tplService.getAll(function(err,tpls){
		var finalTpl={};
		finalTpl.tpls=tpls;
		return res.json(finalTpl);
	});
}

exports.ajSelectTpl=function(req,res){
	tplService.copyTplByNameAccount(req.query.name,req.user.id,function(err){
		websiteService.updateTplById(req.session.website.id,req.query.name,function(err,effectNum){
			return res.json(err);
		});
	});
}

exports.index=function(req,res){
	var pageRender={};
	console.log("tpl "+req.user);
	pageRender.user=req.user;
	pageRender.website=req.session.website;
	pageRender.editTplActive='active';
	_.extend(pageRender,renderObj);
	return res.render("cms/tpls",pageRender);
}