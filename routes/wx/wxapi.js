var wxApiService= require('../../service/wx/WxApiService');
var wxAccountService=require('../../service/wx/WxAccountService');
var wxReplyFollowService=require('../../service/wx/WxReplyFollowService');
var wxReplyRuleService=require('../../service/wx/WxReplyRuleService');
var xml2js=require('xml2js');
exports.initApi=function(req,res){
	var id=req.params.id;
	var rtStr="";
	wxAccountService.findById(id,function(err,wxAccount){
		if(wxAccount){
			var token=wxAccount.token;
			var timestamp=req.query.timestamp;
			var nonce=req.query.nonce;
			var echostr=req.query.echostr;
			var signature=req.query.signature;
			if(wxApiService.check(token,timestamp,nonce,signature)){
				rtStr=echostr;
			}else{
				rtStr="can not find api";
			}
			return res.send(rtStr);
		}else{
			rtStr="can not find account";

		}
        return res.send(rtStr);
	});
}

exports.api=function(req,res){
	console.log(req.body.xml);
	var msgType=req.body.xml.MsgType;
	var wxid=req.params.id;
	console.log("微信ID "+wxid);
	if(msgType[0]=='event'){//事件类型
		var eventType=req.body.xml.Event;
		if(eventType[0]=='subscribe'){
			console.log("用户关注消息 ");
			wxReplyFollowService.findByWxId(wxid,function(err,wxReplyFollow){
				if(wxReplyFollow){
					res.type('xml'); 
					var responseText=wxApiService.toTextXML(wxReplyFollow.word.content,req.body.xml);
					console.log(responseText);
	        		res.send(responseText);
					return res;
				}else{
					res.send("");
					return res;
				}

			});
		}

		// if(eventType[0]=='unsubscribe'){
		// 	console.log("用户取消消息 ");
		// 	res.type('xml');

		// 	return res.send("<xml><ToUserName><![CDATA["+fromUserName[0]+"]]></ToUserName><FromUserName><![CDATA["+toUserName[0]+"]]></FromUserName><CreateTime>"+parseInt(Date.now()/1000)+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[取消关注很遗憾啊，亲]]></Content><FuncFlag>0</FuncFlag></xml>");
		// }

	 }


	if(msgType[0]=='text'){//文本消息
		var keyword=req.body.xml.Content[0];
		console.log("用户发送消息 ");
		res.type('xml');
		exports.findRandomReply(keyword,function(reply){
			var responseText=wxApiService.toTextXML(reply.word.content,req.body.xml);
	        res.send(responseText);
			return res;
		});
		
	}

	// var buf = '';
	// req.setEncoding('utf8');
	// req.on('data', function(chunk) { 
	// 	buf += chunk;
	// });

	//  	//内容接收完毕
	// req.on('end', function() {
	// 	xml2js.parseString(buf, function(err, json) {
	//         if (err) {
	// 			err.status = 400;
	// 		} else {
	// 				 req.body = json;
	// 		}
	// 		console.log(req.body.xml);
	// 		var msgType=req.body.xml.MsgType;
	// 		var toUserName=req.body.xml.ToUserName;
	// 		var fromUserName=req.body.xml.FromUserName;
	// 		if(msgType[0]=='text'){
				

	// 			console.log("用户发送消息 ");
	// 			res.type('xml');
	// 			return res.send("<xml><ToUserName><![CDATA["+fromUserName[0]+"]]></ToUserName><FromUserName><![CDATA["+toUserName[0]+"]]></FromUserName><CreateTime>"+parseInt(Date.now()/1000)+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[新年快乐]]></Content><FuncFlag>0</FuncFlag></xml>");
	// 		}

	// 	});	
	// });


	
	// console.log("这都是什么啊！！");
	// return res.send('ddd');
}

