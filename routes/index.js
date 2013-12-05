var menuService=require('../service/MenuService');
var nodeService=require('../service/NodeService');
var websiteConfig=require('../config/website');
/*
 * GET home page.
 */

exports.index = function(req, res){

  	res.send("hello cms");
};

exports.login=function(req,res){
	res.render('login');
}

exports.logout=function(req,res){
	req.logout();
  	res.redirect('/login');
}

exports.list=function(req,res){
	res.render('mobile/blog');
	//res.send('model='+req.params.channel);
}