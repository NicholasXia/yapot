var wxReplyRuleDao=require("../../model/wx/WxReplyRule");
var _=require('underscore');
exports.add=function(wxReplyRule,cb){
	wxReplyRuleDao.create(wxReplyRule,cb);
}

exports.update=function(id,wxReplyRule,cb){
	var keywordsTmp=[];
	var repliesTmp=[];
	for(var i=0;i<wxReplyRule.keywords.length;i++){
		var keyword={};
		keyword.name=wxReplyRule.keywords[i].name;
		keyword.match=wxReplyRule.keywords[i].match;
		keywordsTmp.push(keyword);
	}
	for(var i=0;i<wxReplyRule.replies.length;i++){
		var reply={word:{content:''}};
		reply.word.content=wxReplyRule.replies[i].word.content;
		reply.rtype=wxReplyRule.replies[i].rtype;
		repliesTmp.push(reply);
	}
	wxReplyRule.keywords=keywordsTmp;
	wxReplyRule.replies=repliesTmp;
	wxReplyRuleDao.update({ "_id": id }, 
		wxReplyRule
		, {upsert:false, multi: false}, cb);
}

exports.findAllByKeyword=function(keyword,cb){
	var mathKeyword = new RegExp(''+keyword+'', 'i'); 
	wxReplyRuleDao.find({keywords:{$elemMatch:{name:mathKeyword}}}).sort({'create_date':-1}).exec(cb);
}

exports.findRandomReply=function(keyword,cb){
	wxReplyRuleDao.findOne({keywords:{$elemMatch:{name:mathKeyword}}}).sort({'create_date':-1}).exec(function(err,rule){
		var random=_.random(0,rule.replies.length-1);
		cb(err,rule.replies[random]);
	});
}

exports.findAll=function(cb){
	wxReplyRuleDao.find().sort({'create_date':-1}).exec(cb);
}

// var wxReplyRule={
// 	wxid:"123123",
// 	name:"测试规则",//规则名称
// 	keywords:[{
// 		name:"您好",
// 		match:true//trun 全文匹配 false 精准匹配
// 	},{
// 		name:"您好",
// 		match:true//trun 全文匹配 false 精准匹配
// 	},{
// 		name:"您好",
// 		match:true//trun 全文匹配 false 精准匹配
// 	}],
// 	replies:[{
// 		rtype:1,
// 		word:{
// 			content:'哈哈，新年快乐。'
// 		}

// 	}],
// 	create_date:new Date() //创建时间
// }
// exports.add(wxReplyRule,function(err,rule){
// 	console.log(err);
// });

// exports.findAllByKeyword('lala',function(err,datas){
// 	console.log(datas);
// });

