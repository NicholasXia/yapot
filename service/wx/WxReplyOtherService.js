var wxReplyOtherDao=require('../../model/wx/WxReplyOther');

exports.saveWordByWxId=function(wxId,word,cb){
	wxReplyOtherDao.update({ wxid: wxId }, {type:1 ,$set:{word:word} }, {upsert:true, multi: false }, cb);
}

exports.findByWxId=function(wxId,cb){
	wxReplyOtherDao.findOne({wxid:wxId},cb);
}