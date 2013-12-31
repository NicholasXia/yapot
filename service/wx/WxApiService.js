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