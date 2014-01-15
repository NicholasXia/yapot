var wxReplyRuleDao=require("../../model/wx/WxReplyRule");
var _=require('underscore');
exports.add=function(wxReplyRule,cb){
	wxReplyRuleDao.create(wxReplyRule,cb);
}

exports.update=function(id,wxReplyRule,cb){
	var keywordsTmp=[];
	var repliesTmp=[];
	console.log(wxReplyRule);
	for(var i=0;i<wxReplyRule.keywords.length;i++){
		var keyword={};
		keyword.name=wxReplyRule.keywords[i].name;
		keyword.match=wxReplyRule.keywords[i].match;
		keywordsTmp.push(keyword);
	}
	for(var i=0;i<wxReplyRule.replies.length;i++){
		var reply={word:{},node:{},gnode:{},channel:{},page:{},gpage:{}};

		reply.rtype=wxReplyRule.replies[i].rtype;
		if(reply.rtype=='1'){//文字类型
			reply.word.content=wxReplyRule.replies[i].word.content;
		}else if(reply.rtype=='2'){//文章类型
			reply.node.node_id=wxReplyRule.replies[i].node.node_id;
			reply.node.title=wxReplyRule.replies[i].node.title;
		}else if(reply.rtype=='3'){//一组文章类型
			reply.gnode.node=[];
			for(var j=0;j<wxReplyRule.replies[i].gnode.node.length;j++){

				var node={};

				node.node_id=wxReplyRule.replies[i].gnode.node[j].node_id;
				node.title=wxReplyRule.replies[i].gnode.node[j].title;
				reply.gnode.node.push(node);
			}
		}else if(reply.rtype=='4'){//频道
			reply.channel.channel_id=wxReplyRule.replies[i].channel.channel_id;
			reply.channel.name=wxReplyRule.replies[i].channel.name;
			reply.channel.num=wxReplyRule.replies[i].channel.num;
		}else if(reply.rtype=='5'){//页面
			reply.page.page_id=wxReplyRule.replies[i].page.page_id;
			reply.page.name=wxReplyRule.replies[i].page.name;
		}else if(reply.rtype=='6'){//一组页面
			reply.gpage.page=[];
			for(var j=0;j<wxReplyRule.replies[i].gpage.page.length;j++){
				var page={};
				page.page_id=wxReplyRule.replies[i].gpage.page[j].page_id;
				page.name=wxReplyRule.replies[i].gpage.page[j].name;
				reply.gpage.page.push(page);
			}
		}
		repliesTmp.push(reply);
	}
	console.log(repliesTmp);
	wxReplyRule.keywords=keywordsTmp;
	wxReplyRule.replies=repliesTmp;
	wxReplyRuleDao.update({ "_id": id }, 
		wxReplyRule
		, {upsert:false, multi: false}, cb);
}

exports.findAllByKeyword=function(mathKeyword,cb){
	var mathKeyword = new RegExp(''+mathKeyword+'', 'i'); 
	wxReplyRuleDao.find({keywords:{$elemMatch:{name:mathKeyword}}}).sort({'create_date':-1}).exec(cb);
}

exports.findRandomReply=function(mathKeyword,cb){
	var mathKeyword = new RegExp(''+mathKeyword+'', 'i'); 
	wxReplyRuleDao.findOne({keywords:{$elemMatch:{name:mathKeyword}}}).sort({'create_date':-1}).exec(function(err,rule){
		if(rule){
			var random=_.random(0,rule.replies.length-1);
			cb(err,rule.replies[random]);
		}else{

			cb(err);
		}
		
	});
}

exports.findAll=function(wxId,cb){
	wxReplyRuleDao.find({'wxid':wxId}).sort({'create_date':-1}).exec(cb);
}

exports.delete=function(id,cb){
	wxReplyRuleDao.remove({"_id":id},cb);
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

// exports.findAllByKeyword('你',function(err,datas){
// 	console.log(datas);
// });

