var wxReplyFollowDao=require('../../model/wx/WxReplyFollow');

exports.saveWordByWxId=function(wxId,word,cb){
	wxReplyFollowDao.update({ wxid: wxId }, {type:1 ,$set:{word:word} }, {upsert:true, multi: false }, cb);
}

exports.findByWxId=function(wxId,cb){
	wxReplyFollowDao.findOne({wxid:wxId},cb);
}