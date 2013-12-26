var websiteDao=require('../model/Website');
var page=require('../model/Page');
var _=require('underscore');
exports.add=function(website,cb){
	websiteDao.create(website,cb);
}

exports.findByEnglishName=function(englishName,cb){
	websiteDao.findOne({english_name:englishName},cb);
}

exports.findById=function(id,cb){
	websiteDao.findOne({"_id":id},cb);
}

exports.findByAccountId=function(accountId,cb){
	websiteDao.findOne({"account_id":accountId},cb);
}

exports.updateById=function(id,website,cb){
	websiteDao.update({"_id":id},{$set:{name:website.name,imgurl:website.imgurl}},{multi:false},function(err,numAffected){
		if(err) cb(err);
		if(numAffected==0) cb('{error:1}');
		cb();
	});
}

exports.updateTplById=function(id,tplname,cb){
	websiteDao.update({"_id":id},{$set:{tplname:tplname}},{multi:false},function(err,numAffected){
		if(err) cb(err);
		if(numAffected==0) cb('{error:1}');
		cb();
	});
}

//Test Code
// exports.add(
// 	{account_id:'5296ab15dbdd4e141d000001',name:'中国妇产科网',english_name:'fuchanke',status:websiteDao.ACTIVE},
// 	function(){

// });

// exports.findByEnglishName('fuchanke',function(err,fuchanke){
// 	console.log(fuchanke);
// });

// exports.findById('5296adddcd9b439c16000001',function(err,website){
// 	console.log(website);
// 	var website=_.clone(website);

// 	website['aa']=1

// 	console.log(website.aa);
// 	console.log(JSON.parse(JSON.stringify(website)).aa);
// });

