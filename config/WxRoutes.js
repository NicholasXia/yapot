var wxMy=require('../routes/wx/my');
var reply=require('../routes/wx/reply');
var wxApi=require('../routes/wx/wxapi');
var wxApiService= require('../service/wx/WxApiService');
var wxAccountService=require('../service/wx/WxAccountService');
var xml2js=require('xml2js');

function testAuth(req,res,next){
	console.log("牛叉");
	var buf = '';

	req.setEncoding('utf8');
	req.on('data', function(chunk) { 
    	buf += chunk;
	});

	 	// 内容接收完毕
	req.on('end', function() {
    	xml2js.parseString(buf, function(err, json) {
            if (err) {
    			err.status = 400;
			} else {
   				 req.body = json;
			}
			console.log("next ok");
			return next();
		});	
	});
}

function checkAuth(req,res,next){
	console.log("判断是否为微信");
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
				//获取微信内容
				var buf = '';
    			req.setEncoding('utf8');
    			req.on('data', function(chunk) { 
                	buf += chunk;
        		});
        
       		 	// 内容接收完毕
    			req.on('end', function() {
                	xml2js.parseString(buf, function(err, json) {
                        if (err) {
                			err.status = 400;
            			} else {
               				 req.body = json;
            			}
            			console.log("next ok");
            			return next();
        			});	
				});
			}else{
				console.log(rtStr);
				rtStr="can not find account";

			}
		}else{
			console.log(rtStr);
        	return res.send(rtStr);
		}
	
	});
}


exports.routes=function(auth,app){
	app.get('/wx/index',auth,wxMy.index);
	app.post('/wx/ajSaveInit',auth,wxMy.ajSaveInit);
	app.get('/wx/reply/follow',auth,reply.follow);
	app.get('/wx/reply/keywords',auth,reply.keywords);
	app.get('/wx/reply/other',auth,reply.other);
	app.post('/wx/reply/ajSaveRule',auth,reply.ajSaveRule);
	app.post('/wx/reply/ajSaveFollowWord',auth,reply.ajSaveFollowWord);
	app.post('/wx/reply/ajSaveOtherWord',auth,reply.ajSaveOtherWord);
	app.get('/wx/reply/ajFindAll',auth,reply.ajFindAll);
	
}

exports.routesApi=function(app){
	app.get('/wx/api/:id',wxApi.initApi);
	app.post('/wx/api/:id',checkAuth,wxApi.api);
}


