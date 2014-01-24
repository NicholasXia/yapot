var _=require('underscore');
var wxAccountService=require('../../service/wx/WxAccountService');
var rendObj={
	wxActive:'active'
}
exports.index=function(req,res){
	rendObj.user=req.user;
	rendObj.wxIndexActive='active';
	wxAccountService.findByAccountId(req.user.id,function(err,wxAccount){
		if(wxAccount){
			rendObj.wxAccount=wxAccount;
			return res.render('wx/index',rendObj);
		}else{
			return res.render('wx/init',rendObj);
		}
	});	
}

exports.ajSaveInit=function(req,res){
	req.body.accountId=req.user.id;
	req.body.token=_.random(10000,99999);
	wxAccountService.add(req.body,function(err,wxAccount){
		req.session.wxAccount=wxAccount;
		return res.json(wxAccount);
	});
}


exports.ajSaveApp=function(req,res){
	var app={
		appid:req.query.appid,
		secret:req.query.secret
	};
	wxAccountService.saveApp(req.user.id,app,function(err,num){
		console.log(err+" = "+num);
		res.json(num);
	});
}
