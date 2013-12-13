var tplService = require('../../service/TplService');

exports.ajGetAll=function(req,res){
	tplService.getAll(function(err,tpls){
		var finalTpl={};
		finalTpl.tpls=tpls;
		return res.json(finalTpl);
	});
}