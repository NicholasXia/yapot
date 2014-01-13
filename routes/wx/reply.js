var wxReplyFollowService=require('../../service/wx/WxReplyFollowService');
var wxReplyOtherService=require('../../service/wx/WxReplyOtherService');
var wxReplyRuleService=require('../../service/wx/WxReplyRuleService');
var _=require('underscore');
var renderObj={
	wxActive:'active',
	replyActive:'active'
}
exports.follow=function(req,res){
	var wxId=req.session.wxAccount._id;


	var pageRender={};
	_.extend(pageRender,renderObj);
	pageRender.followActive='active';
	pageRender.user=req.user;
	wxReplyFollowService.findByWxId(wxId,function(err,wxRly){
		pageRender.wxRpy=wxRly;
		return res.render('wx/reply_follow',pageRender);
	});
}

exports.keywords=function(req,res){
	var wxId=req.session.wxAccount._id;
	var pageRender={};
	_.extend(pageRender,renderObj);
	pageRender.keywordsActive='active';
	pageRender.user=req.user;
	return res.render('wx/reply_keywords',pageRender);
}

exports.other=function(req,res){
	var wxId=req.session.wxAccount._id;

	var pageRender={};
	_.extend(pageRender,renderObj);
	pageRender.otherActive='active';
	pageRender.user=req.user;
	wxReplyOtherService.findByWxId(wxId,function(err,wxRly){
		pageRender.wxRpy=wxRly;
		return res.render('wx/reply_other',pageRender);
	});
}

exports.ajSaveFollowWord=function(req,res){
	var wxId=req.session.wxAccount._id;
	console.log("微信账号ID "+wxId);
	var wordContent=req.body.word;
	var word={
		content:wordContent
	}
	wxReplyFollowService.saveWordByWxId(wxId,word,function(err,num){
		return res.json(err);
	});
}

exports.ajSaveOtherWord=function(req,res){
	var wxId=req.session.wxAccount._id;
	console.log("微信账号ID "+wxId);
	var wordContent=req.body.word;
	var word={
		content:wordContent
	}
	wxReplyOtherService.saveWordByWxId(wxId,word,function(err,num){
		return res.json(err);
	});
}

exports.ajSaveRule=function(req,res){
	var wxId=req.session.wxAccount._id;
	var rule={};
	var id=req.body.id;
	console.log(req.body.rule.replies[0].word);
	_.extend(rule,req.body.rule);
	// rule._id=id;
	rule.wxid=wxId;
	
	console.log("id "+id);
	console.log(rule.replies[0].word);

	if(id){
		wxReplyRuleService.update(id,rule,function(err,num){

			return res.json(rule);
		});
	}else{
		rule.create_date=new Date();
		wxReplyRuleService.add(rule,function(err,rule){
		
			console.log("err="+err);
			console.log("added="+rule);
			return res.json(rule);
		});
	}
	
}

exports.ajFindAll=function(req,res){
	wxReplyRuleService.findAll(function(err,rules){
		return res.json(rules);
	});
}