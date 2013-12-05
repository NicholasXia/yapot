/**
Helper Service
*/

exports.initUser=function(req,res,next){
	var session=req.session;
	var cookies=req.cookies;
	//随机用户登录
	if(!cookies.userRandomId){
		res.cookie('userRandomId', Math.random(), { expires: new Date(Date.now() + 365*24*60*60*1000), httpOnly: true });
	}
	return next();
}