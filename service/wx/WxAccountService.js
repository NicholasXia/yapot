var wxAccountDao=require('../../model/wx/WxAccount');

exports.findByAccountId=function(accountId,cb){
	wxAccountDao.findOne({accountId:accountId},cb);
}

exports.findById=function(id,cb){
	wxAccountDao.findOne({'_id':id},cb);
}

exports.add=function(wexinObj,cb){
	wxAccountDao.create(wexinObj,cb);
}

exports.saveApp=function(accountId,app,cb){
	wxAccountDao.update({ "accountId": accountId }, {$set:{app:app} }, {upsert:true, multi: false }, cb);
}