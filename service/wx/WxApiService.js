var CryptoJS = require("crypto-js");
exports.check=function(token,timestamp,nonce,signature){
	var tmpAry=[];
	tmpAry.push(token);
	tmpAry.push(timestamp);
	tmpAry.push(nonce);
	tmpAry.sort();
	var tmpStr=tmpAry.join('');
	var sha1Str=CryptoJS.SHA1(tmpStr);
	var checked=false;
	console.log(tmpAry);
	console.log("验证 "+sha1Str+" signature "+signature);
	if(sha1Str==signature) checked=true;
	return checked;
}


exports.toTextXML=function(content,weixinObj){
	var responseText="<xml><ToUserName><![CDATA["+weixinObj.FromUserName[0]+"]]></ToUserName><FromUserName><![CDATA["+weixinObj.ToUserName[0]+"]]></FromUserName><CreateTime>"+parseInt(Date.now()/1000)+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+content+"]]></Content><FuncFlag>0</FuncFlag></xml>";
	return responseText;
}

exports.toSingleXML=function(title,des,picurl,url,weixinObj){
	var responseNews=""+
	"<xml>"+
		"<ToUserName><![CDATA["+weixinObj.FromUserName[0]+"]]></ToUserName>"+
		"<FromUserName><![CDATA["+weixinObj.ToUserName[0]+"]]></FromUserName>"+
		"<CreateTime>"+parseInt(Date.now()/1000)+"</CreateTime>"+
		"<MsgType><![CDATA[news]]></MsgType>"+
		"<ArticleCount>1</ArticleCount>"+
		"<Articles>"+
		"<item>"+
		"<Title><![CDATA["+title+"]]></Title>"+ 
		"<Description><![CDATA["+des+"]]></Description>"+
		"<PicUrl><![CDATA["+picurl+"]]></PicUrl>"+
		"<Url><![CDATA["+url+"]]></Url>"+
		"</item>"+
		"</Articles>"+
	"</xml> "
	console.log("发送单图文 "+responseNews);
	return responseNews;
}

exports.toMultXML=function(articles,weixinObj){
	var articleStr="";
	for(var i=0;i<articles.length;i++){
		var title=articles[i].wxTitle;
		var des=articles[i].wxDes;
		var picurl=articles[i].wxImg;
		var url=articles[i].wxUrl;
		articleStr+="<item>"+
		"<Title><![CDATA["+title+"]]></Title>"+ 
		"<Description><![CDATA["+des+"]]></Description>"+
		"<PicUrl><![CDATA["+picurl+"]]></PicUrl>"+
		"<Url><![CDATA["+url+"]]></Url>"+
		"</item>";
	}

	var responseNews=""+
	"<xml>"+
		"<ToUserName><![CDATA["+weixinObj.FromUserName[0]+"]]></ToUserName>"+
		"<FromUserName><![CDATA["+weixinObj.ToUserName[0]+"]]></FromUserName>"+
		"<CreateTime>"+parseInt(Date.now()/1000)+"</CreateTime>"+
		"<MsgType><![CDATA[news]]></MsgType>"+
		"<ArticleCount>"+articles.length+"</ArticleCount>"+
		"<Articles>"+
		 articleStr+
		"</Articles>"+
	"</xml> "
	console.log("发送多图文 "+responseNews);
	return responseNews;
}



exports.getAccessToken=function(appid,secret,cb){
	request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,function(err,rep,body){
		var body=JSON.parse(body);
		if(body.errcode){
			cb(body,null);
		}else{
			cb(null,body);
		}
		
	});
}
/*
{
    "button": [
        {
            "type": "view", 
            "name": "中国妇产科微官网", 
            "url": "http://weixin.china-obgyn.net/u/obgyn"
        }
    ]
}
*/
exports.addMenu=function(menuObj,accessToken,cb){
	var menuStr=JSON.stringify(menuObj);
	console.log(menuStr);
	var opts={
		body:menuStr,
		url:'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+accessToken,
		method:'POST'

	}
	request(opts,cb);

}

// var menuObj={
//     "button": [
//         {
//             "type": "view", 
//             "name": "微官网", 
//             "url": "http://weixin.china-obgyn.net/u/obgyn"
//         },
//         {
//            "name":"实时更新",
//            "sub_button":[
//            {	
//                "type":"view",
//                "name":"专业文章",
//                "url":"http://weixin.china-obgyn.net/u/obgyn/art"
//             },
//             {
//                "type":"view",
//                "name":"新闻资讯",
//                "url":"http://weixin.china-obgyn.net/u/obgyn/newss"
//             },
//             {
//                "type":"view",
//                "name":"会议通知",
//                "url":"http://weixin.china-obgyn.net/u/obgyn/meetings"
//             },
//             {
//                "type":"view",
//                "name":"图书推荐",
//                "url":"http://weixin.china-obgyn.net/u/obgyn/booking"
//             }]
//         }
//     ]
// }
// exports.getAccessToken('wxa5c24287eb47aa1f','e97abfdd70a285a61875f8e6311c78d2',function(err,accessToken){
// 	console.log(accessToken);
// 	exports.addMenu(menuObj,accessToken.access_token,function(err,res,body){
// 		console.log(err+" "+body);
// 	});
// });
