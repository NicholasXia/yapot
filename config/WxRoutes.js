var wxMy=require('../routes/wx/my');
var wxApi=require('../routes/wx/wxapi');
exports.routes=function(auth,app){
	app.get('/wx/index',auth,wxMy.index);
	app.post('/wx/ajSaveInit',auth,wxMy.ajSaveInit);
	app.get('/wx/api/:id',wxApi.api);
}


