var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var websiteConfig=require('../config/website');
/*
 * GET home page.
 */

exports.index = function(req, res){
  	return res.send("hello cms");
};

exports.login=function(req,res){
	req.logout();
	return res.render('login');
}

exports.logout=function(req,res){
	req.logout();
  	return res.redirect('/login');
}

exports.list=function(req,res){
	return res.render('mobile/blog');
	//res.send('model='+req.params.channel);
}