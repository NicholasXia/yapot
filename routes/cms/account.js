var accountService=require('../../service/AccountService');
var config=require('../../config/website');
exports.index=function(req,res){
	return res.render('cms/admin/account',{user:req.user,accountActive:'active'});
}

exports.ajList=function(req,res){
	var pageParam={
		"iDisplayStart":req.query.start,
		"iDisplayLength":config.PER_PAGE_NUM
	}
	accountService.findAllPage(pageParam,function(err,page){
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
	accountService.add(account,function(err,data){
		return res.json(data);
	});
}

exports.ajUpdatePassword=function(req,res){
	accountService.updatePasswordById(req.query.accountid,req.query.password,function(err){
		return res.json(err);
	});
}