var wxApiService= require('../../service/wx/WxApiService');
var wxAccountService=require('../../service/wx/WxAccountService');
var wxReplyFollowService=require('../../service/wx/WxReplyFollowService');
var wxReplyOtherService=require('../../service/wx/WxReplyOtherService');
var wxReplyRuleService=require('../../service/wx/WxReplyRuleService');
var nodeService=require('../../service/NodeService');
var pagerService=require('../../service/PagerService');
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
		wxReplyRuleService.findRandomReply(keyword,function(err,reply){
			// console.log(reply);
			if(reply){
				if(reply.rtype=='1'){//文字类型
					var responseText=wxApiService.toTextXML(reply.word.content,req.body.xml);
		        	res.send(responseText);
				}else if(reply.rtype=='2'){//图文类型
					nodeService.findById(reply.node.node_id,function(err,node){
						console.log(node);
						var responseNews=wxApiService.toSingleXML(node.wxTitle,node.wxTitle,node.wxImg,node.wxUrl,req.body.xml);
						res.send(responseNews);
					});
				}else if(reply.rtype=='3'){//多图文类型
					var ids=[];
			
					for(var i=0;i<reply.gnode.node.length;i++){
						
						ids.push(reply.gnode.node[i].node_id);
					}
					
					nodeService.findByIds(ids,function(err,nodes){
						console.log(nodes);
						if(nodes){
							var responseNews=wxApiService.toMultXML(nodes,req.body.xml);
							res.send(responseNews);
						}
						
					});
					
				}else if(reply.rtype=='4'){//频道
					nodeService.findLatestByChannelId(reply.channel.channel_id,reply.channel.num,function(err,nodes){
						if(nodes){
							var responseNews=wxApiService.toMultXML(nodes,req.body.xml);
							res.send(responseNews);
						}
					});
				}else if(reply.rtype=='5'){//页面
					pagerService.findById(reply.page.page_id,function(err,page){
						if(page){
							var responseNews=wxApiService.toSingleXML(page.name,page.name,'',page.wxUrl,req.body.xml);
							res.send(responseNews);
						}
					});
				}else if(reply.rtype=='6'){//一组页面
					var ids=[];
			
					for(var i=0;i<reply.gpage.page.length;i++){
						
						ids.push(reply.gpage.page[i].page_id);
					}
					
					pagerService.findByIds(ids,function(err,pages){
			
						if(pages){
							var responseNews=wxApiService.toMultXML(pages,req.body.xml);
							res.send(responseNews);
						}
						
					});
				}
			}else{//无回复
				wxReplyOtherService.findByWxId(wxid,function(err,wxReplyOther){
					if(wxReplyOther){
						res.type('xml'); 
						var responseText=wxApiService.toTextXML(wxReplyOther.word.content,req.body.xml);
						console.log(responseText);
		        		res.send(responseText);
						return res;
					}else{
						res.send("");
						return res;
					}

				});
			}
			
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

