var channelService=require('../../service/ChannelService');
exports.index=function(req,res){
	// console.log(req.user);
	res.render("cms/channel",{user:req.user,channelActive:'active'});
}

exports.ajGetTree=function(req,res){
	var websiteId=req.session.website.id;
	channelService.findAllTree(websiteId,function(err,channelTree){
		res.json(channelTree);
	});
}

exports.ajAdd=function(req,res){
	var channel=req.query.channel;
	var english_channel=req.query.english_channel;
	var websiteId=req.session.website.id;
	channelService.add(websiteId,channel,english_channel,function(err,channel){
		res.json(channel);
	});
}

exports.ajDelete=function(req,res){
	var id=req.query.id;
	channelService.deleteById(id,function(err){
		res.json(err);
	});
}