var accountService=require('../../service/AccountService');
var config=require('../../config/website');
exports.index=function(req,res){
	return res.render('cms/admin/account',{user:req.user,accountActive:'active'});
}

exports.ajList=function(req,res){
	accountService.findAllPage(req.query,function(err,page){
		return res.json(page);
	});
	
}

exports.ajAdd=function(req,res){
	var account={
		email:req.query.email,
		name:req.query.username,
		password:req.query.password,
		reg_date:new Date(),
		exp_date:moment().add('years',1),
		role:req.query.role,
		status:1
	};
	accountService.addAndMakeFolder(account,function(err,data){
		if(err) return res.json(err);
		return res.json(data);
	});
}

exports.ajUpdatePassword=function(req,res){
	accountService.updatePasswordById(req.query.accountid,req.query.password,function(err){
		return res.json(err);
	});
}