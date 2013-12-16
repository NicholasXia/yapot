var nodeService=require('../../service/NodeService');
var _=require('underscore');
var nodeObj={
	nodeActive:'active'
}

exports.index=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.nodeManActive='active';
	_.extend(pageRender,nodeObj);
	res.render("cms/node",pageRender);
}

exports.addArticle=function(req,res){
	var pageRender={};
	pageRender.user=req.user;
	pageRender.articleActive='active';
	_.extend(pageRender,nodeObj);
	res.render("cms/add_article",pageRender);
}

exports.ajList=function(req,res){
	var channelId=req.query.channelId;
	nodeService.findByChannelId(channelId,req.query,function(err,docs){
		res.json(docs);
	});

}

exports.ajAddArticle=function(req,res){
	var websiteId=req.session.website.id;
	console.log(req.query.channelId);
	nodeService.addArticle(websiteId,req.query.channelId,req.query.title,req.query.content,req.query.imgUrl,function(err,article){
		res.json(article);
	});
}

exports.ajDeleteArticle=function(req,res){
	nodeService.deleteNodeById(req.query.id,function(err){
		res.json(err);
	});
}
//websiteId,channelId,title,content,imgUrl,videoUrl
exports.ajAddVideo=function(req,res){
	var websiteId=req.session.website.id;
	console.log(req.query.channelId);
	nodeService.addVideo(
		websiteId,
		req.query.channelId,
		req.query.title,
		req.query.content,
		req.query.videoUrl,
		req.query.imgUrl,
		function(err,video){
			res.json(video);
		});
}
