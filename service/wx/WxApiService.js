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
