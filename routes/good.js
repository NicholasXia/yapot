var goodService=require('../service/GoodService');

exports.ajAddGood=function(req,res){
	
	var userRandomId=req.cookies.userRandomId;
	var websiteId=req.query.websiteid;
	var channelId=req.query.channelid;
	var nodeId=req.query.nodeid;

	goodService.findByNodeRandomId(nodeId,userRandomId,function(err,user){
		console.log("nodeId "+nodeId);
		console.log("userRandomId "+userRandomId);
		console.log("user "+user);
		if(!user){
			goodService.addGood(websiteId,channelId,nodeId,userRandomId,function(err,doc){
				console.log(doc);
				res.json(doc);
			});
		}else{
			res.json({error:1});
		}

	});
}
//返回赞的状态，如果为1为开启0为关闭
exports.ajGetGoodStatus=function(req,res){
	var userRandomId=req.cookies.userRandomId;
	var nodeId=req.query.nodeid;
	console.log('userRandomId '+userRandomId);
	goodService.findByNodeRandomId(nodeId,userRandomId,function(err,user){
		console.log(user);
		if(user==null){
			console.log('cc '+user);
			res.json({status:1});
		}else{
			res.json({status:0});
		}
		
		
	});
}
