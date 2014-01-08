
/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var routes = require('./routes');
var user = require('./routes/user');
var node=require('./routes/node');
var website=require('./routes/website');
var channel=require('./routes/channel');
var good=require('./routes/good');
var pager=require('./routes/pager');
var channelCms=require('./routes/cms/channel');
var my=require('./routes/cms/my')
var nodeCms=require('./routes/cms/node');
var menuCms=require('./routes/cms/menu');
var pagerCms=require('./routes/cms/pager')
var accountCms=require('./routes/cms/account');
var tplCms=require('./routes/cms/tpl');
var http = require('http');
var path = require('path');
var upload = require('jquery-file-upload-middleware');
var config=require('./config/website');
var wxRoutesConfig=require('./config/WxRoutes');
var app = express();
require("./model/MongoConnect");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var accountService=require('./service/AccountService');
var helperService=require('./service/HelperService');
var websiteService=require('./service/WebsiteService');
var channelService=require('./service/ChannelService');
// configure upload middleware
upload.configure({
    // uploadDir: __dirname + '/public/uploads',
    // uploadUrl: '/uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'templates')));
// app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use('/upload', upload.fileHandler());
app.use('/upload', function (req, res, next) {
      console.log("upload "+__dirname + '/public/users/' + req.query.id+"/upload/");
      upload.fileHandler({
          uploadDir: function () {
              return __dirname + '/public/users/' + req.query.id+"/upload/";
          },
          uploadUrl: function () {
              return '/users/' + req.query.id+"/upload/";
          }
      })(req, res, next);
});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'secret',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({
      db: 'weixincms'
    })
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


app.get('/login',routes.login);
app.get('/logout',routes.logout);
app.get('/aj/ajAddGood',good.ajAddGood);
app.get('/aj/ajGetGoodStatus',good.ajGetGoodStatus);
app.get('/node/ajlist',node.ajList);
app.get('/u/:website',helperService.initUser,website.index);
app.get('/u/:website/p/:id',helperService.initUser,pager.details);
app.get('/u/:website/:channel',helperService.initUser,channel.index);
app.get('/u/:website/:channel/:id',helperService.initUser,node.details);

passport.use(new LocalStrategy({
		usernameField: 'email',
    	passwordField: 'password'
	},
    function(username, password, done) {
    	console.log(username+" "+password);
      if(username==config.ADMIN&&password==config.PASSWORD){//系统管理员
        var user={};
        user.id='0';
        user.email=username;
        user.name='admin';
        user.role=0;//管理员
        console.log('pass');
        return done(null,user);
      }

  		accountService.login(username,password,function(err,user){
        console.log(user);
  		 if (err) { return done(err);} 

  		 if(!user){
  		 	return done(null, false);
  		 }
	     return done(null, user);
  	});
  }
));

passport.serializeUser(function(user, done) {
  console.log("user.id "+user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { 
  console.log('id='+id);
  if(id=='0'){
    var user={};
    user.id='0';
    user.email=config.ADMIN;
    user.name='admin';
    user.role=0;//管理员
    done(null,user);
  }else{
    accountService.findById(id,function(err,user){
        if(err) done(err);
        done(err,user);
    });
  }
  
});



app.post('/ajLogin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    // console.log("lll "+req.user.email);
    // console.log(user);
   console.log("user "+user.email);
    if (err) { return next(err); }

    if (!user) { return res.send({ login: "error"});}
    req.login(user,function(err){
      console.log("err"+err);
      if (err) { return res.send({ login: "error"});}
      return res.send({ login: "ok"});
    });
    
  })(req, res, next);
});



//EDITOR


app.get('/cms/redirectIndex',ensureAuthenticated,my.redirectIndex);
app.get('/cms/index',ensureEditor,my.index);

app.get('/cms/website/ajUpdate',ensureEditor,my.ajUpdate);

app.get('/cms/channel/index',ensureEditor,channelCms.index);
app.get('/cms/channel/ajGetTree',ensureEditor,channelCms.ajGetTree);
app.get('/cms/channel/ajAdd',ensureEditor,channelCms.ajAdd);
app.get('/cms/channel/ajDelete',ensureEditor,channelCms.ajDelete);
app.get('/cms/channel/ajGetAll',ensureEditor,channelCms.ajGetAll);


app.get('/cms/node/index',ensureEditor,nodeCms.index);
app.get('/cms/node/ajList',ensureEditor,nodeCms.ajList);
app.get('/cms/node/addArticle',ensureEditor,nodeCms.addArticle);
app.post('/cms/node/ajAddArticle',ensureEditor,nodeCms.ajAddArticle);
app.get('/cms/node/ajDeleteArticle',ensureEditor,nodeCms.ajDeleteArticle);
app.post('/cms/node/ajAddVideo',ensureEditor,nodeCms.ajAddVideo);
app.get('/cms/node/ajGetById',ensureEditor,nodeCms.ajGetById);
app.post('/cms/node/ajUpdateArticle',ensureEditor,nodeCms.ajUpdateArticle);
app.post('/cms/node/ajUpdateVideo',ensureEditor,nodeCms.ajUpdateVideo);

app.get('/cms/pager/index',ensureEditor,pagerCms.index);
app.get('/cms/pager/ajGetTree',ensureEditor,pagerCms.ajGetTree);
app.post('/cms/pager/ajAdd',ensureEditor,pagerCms.ajAdd);
app.get('/cms/pager/ajDelete',ensureEditor,pagerCms.ajDelete);
app.get('/cms/pager/ajFindById',ensureEditor,pagerCms.ajFindById);
app.post('/cms/pager/ajUpdate',ensureEditor,pagerCms.ajUpdate);
app.get('/cms/pager/ajGetByWebsiteId',ensureEditor,pagerCms.ajGetByWebsiteId);


app.get('/cms/menu/index',ensureEditor,menuCms.index);
app.get('/cms/menu/ajGetTree',ensureEditor,menuCms.ajGetTree);
app.get('/cms/menu/addParent',ensureEditor,menuCms.addParent);
app.get('/cms/menu/deleteParent',ensureEditor,menuCms.deleteParent);
app.get('/cms/menu/ajFindById',ensureEditor,menuCms.ajFindById);
app.get('/cms/menu/ajUpdate',ensureEditor,menuCms.ajUpdate);

app.post('/cms/ajSaveInit',ensureEditor,my.ajSaveInit);
app.get('/cms/tpl/ajGetAll',ensureEditor,tplCms.ajGetAll);
app.get('/cms/tpl/index',ensureEditor,tplCms.index);
app.get('/cms/tpl/ajSelectTpl',ensureEditor,tplCms.ajSelectTpl);
app.get('/cms/tpl/edit',ensureEditor,tplCms.edit);
app.get('/cms/tpls/ajGetTree',ensureEditor,tplCms.ajGetTree);
app.get('/cms/tpls/ajGetByFileName',ensureEditor,tplCms.ajGetByFileName);
app.post('/cms/tpls/ajSaveTpl',ensureEditor,tplCms.ajSaveTpl);

//ADMIN
app.get('/cms/admin/index',ensureAdmin,my.indexAdmin);
app.get('/cms/admin/account/index',ensureAdmin,accountCms.index);
app.get('/cms/admin/account/ajList',ensureAdmin,accountCms.ajList);
app.get('/cms/admin/account/ajAdd',ensureAdmin,accountCms.ajAdd);
app.get('/cms/admin/account/ajUpdatePassword',ensureAdmin,accountCms.ajUpdatePassword);

//WX
wxRoutesConfig.routes(ensureEditor,app);
wxRoutesConfig.routesApi(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureEditor(req,res,next){
   if (req.isAuthenticated()) { 
    if(req.user.role==0){
      console.log("ddd" +req.user.role);
       return res.send('无权限111');
    }
    return next(); 
  }
  return res.redirect('/login');
}

function ensureAdmin(req,res,next){
   if (req.isAuthenticated()) { 
    if(req.user.role!=0){
       return res.send('无权限');
    }
    return next(); 
  }
  return res.redirect('/login');
}
		
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
   
    return next(); 
  }
  return res.redirect('/login');
}

