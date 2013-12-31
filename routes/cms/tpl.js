var tplService = require('../../service/TplService');
var _=require('underscore');
var websiteService = require('../../service/WebsiteService');
var renderObj={
	tplActive:'active',
	cmsActive:'active'
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
	pageRender.selectTplActive='active';
	_.extend(pageRender,renderObj);
	return res.render("cms/tpls",pageRender);
}

exports.edit=function(req,res){
	var pageRender={};
	console.log("tpl "+req.user);
	pageRender.user=req.user;
	pageRender.website=req.session.website;
	pageRender.editTplActive='active';
	_.extend(pageRender,renderObj);
	return res.render("cms/edittpls",pageRender);
}

exports.ajGetTree=function(req,res){
	var accountId=req.user.id;
	websiteService.findByAccountId(accountId,function(err,website){
		tplService.getTplsTreeByAccountId(accountId,website.tplname,function(tree){
			return res.json(tree);
		});
	});
}

exports.ajGetByFileName=function(req,res){
	var accountId=req.user.id;
	var filename=req.query.filename;
	websiteService.findByAccountId(accountId,function(err,website){
		tplService.getTplFileByAccountId(accountId,website.tplname,filename,function(file){
			return res.json(file);
		});
	});
}

exports.ajSaveTpl=function(req,res){
	var accountId=req.user.id;
	var tplname=req.body.tplname;
	var filename=req.body.filename;
	var content=req.body.content;
	tplService.saveTplByAccountId(accountId,tplname,filename,content,function(data){
		res.json(data);
	});
}