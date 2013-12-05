var goodDao=require('../model/Good');
var nodeService=require('./NodeService');

exports.addGood=function(websiteId,channelId,nodeId,userRandomId,cb){
	
	var params={
		website_id:websiteId,//网站ID
		channel_id:channelId,//频道ID
		node_id:nodeId,//文章ID
		user_random_id:userRandomId,//随机用户信息
		create_date:new Date()
	};

	nodeService.updateByNodeId(nodeId,function(err,numEffect){
		goodDao.create(params,cb);
	});

}

exports.findByNodeRandomId=function(nodeId,randomUserId,cb){
	goodDao.findOne({node_id:nodeId,user_random_id:randomUserId},cb);
}

// exports.addGood('5296adddcd9b439c16000001','5296af90037faf0007000001','529e917a9d30229837000001','0.184366790112108',function(err,doc){
// 	console.log(err);
// });

// exports.findByNodeRandomId('529e939a9d30229837000003',0.184366790112108,function(err,user){
// 	console.log(user);
// });