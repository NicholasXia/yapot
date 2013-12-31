var wxApiService= require('../../service/wx/WxApiService');
var wxAccountService=require('../../service/wx/WxApiService');
exports.api=function(req,res){

	var id=req.params.id;
	wxAccountService.findById(id,function(err,wxAccount){
		var token=wxAccount.token;
		var timestamp=req.query.timestamp;
		var nonce=req.query.nonce;
		var echostr=req.query.echostr;
		var signature=req.query.signature;
		if(wxApiService.check(token,timestamp,nonce,signature)){
			return res.send(echostr);
		}
	});
	
}