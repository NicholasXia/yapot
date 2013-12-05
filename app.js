
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
var channelCms=require('./routes/cms/channel');
var my=require('./routes/cms/my')
var nodeCms=require('./routes/cms/node');
var menuCms=require('./routes/cms/menu');
var http = require('http');
var path = require('path');
var upload = require('jquery-file-upload-middleware');
var app = express();
require("./model/MongoConnect");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var accountService=require('./service/AccountService');
var helperService=require('./service/HelperService');
// configure upload middleware
upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads',
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
// app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use('/upload', upload.fileHandler());

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
app.get('/u/:website',helperService.initUser,website.index);
app.get('/u/:website/:channel',helperService.initUser,channel.index);
app.get('/u/:website/:channel/:id',helperService.initUser,node.details);
app.get('/aj/ajAddGood',helperService.initUser,good.ajAddGood);
app.get('/aj/ajGetGoodStatus',helperService.initUser,good.ajGetGoodStatus);


//node
app.get('/node/ajlist',helperService.initUser,node.ajList);


    
passport.use(new LocalStrategy({
		usernameField: 'email',
    	passwordField: 'password'
	},
    function(username, password, done) {
    	console.log(username+"="+password);

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
  
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { 

  accountService.findById(id,function(err,user){


        if(err) done(err);
        done(err,user);
  });
});



app.post('/ajLogin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    // console.log("lll "+req.user.email);
    // console.log(user);
   console.log(info);
    if (err) { return next(err); }

    if (!user) { return res.send({ login: "error"});}
    req.login(user,function(err){
      if (err) { return res.send({ login: "error"});}
      return res.send({ login: "ok"});
    });
    
  })(req, res, next);
});

app.get('/cms/index',ensureAuthenticated,my.index);
app.get('/cms/channel/index',ensureAuthenticated,channelCms.index);
app.get('/cms/channel/ajGetTree',ensureAuthenticated,channelCms.ajGetTree);
app.get('/cms/channel/ajAdd',ensureAuthenticated,channelCms.ajAdd);
app.get('/cms/channel/ajDelete',ensureAuthenticated,channelCms.ajDelete);
app.get('/cms/node/index',ensureAuthenticated,nodeCms.index);
app.get('/cms/node/ajList',ensureAuthenticated,nodeCms.ajList);
app.get('/cms/node/addArticle',ensureAuthenticated,nodeCms.addArticle);
app.get('/cms/node/ajAddArticle',ensureAuthenticated,nodeCms.ajAddArticle);
app.get('/cms/node/ajDeleteArticle',ensureAuthenticated,nodeCms.ajDeleteArticle);

app.get('/cms/menu/index',ensureAuthenticated,menuCms.index);
app.get('/cms/menu/ajGetTree',ensureAuthenticated,menuCms.ajGetTree);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
		
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

