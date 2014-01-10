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
