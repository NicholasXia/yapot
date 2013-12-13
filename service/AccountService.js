var accountDao=require('../model/Account');
var CryptoJS = require("crypto-js");
var page=require("../model/Page");
var moment = require('moment');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
//添加一个账号
exports.add=function(user,cb){
	
	function cbSave(err,data){
		cb(err,data);
	}
	user.password=CryptoJS.MD5(user.password)+"";
	accountDao.create(user,cbSave);
}
//添加账户并且声称用户的目录
exports.addAndMakeFolder=function(user,cb){
	exports.add(user,function(err,account){
		fs.mkdir(__dirname.replace('service','')+'/public/users/'+account.id,function(err){
			fs.mkdir(__dirname.replace('service','')+'/views/users/'+account.id,function(err){
				fs.mkdir(__dirname.replace('service','')+'/public/users/'+account.id+'/skin',function(err){
					fs.mkdir(__dirname.replace('service','')+'/public/users/'+account.id+'/upload',function(err){
						cb(err,account);
					});
				});
			});
		});
		
	});
}

//登录
exports.login=function(email,password,cb){
	if(password.length<20){
		password=CryptoJS.MD5(password)+"";
	}
	var con={
		email:email,
		password:password
		// exp_date:{$gt:new Date()},
		// status:accountDao.ACTIVE
	}
	accountDao.findOne(con,function(err,account){
		cb(err,account);
		
	});
}

exports.updatePasswordById=function(accountId,password,cb){
	accountDao.update({"_id":accountId},{$set:{password:CryptoJS.MD5(password)+""}},{multi:false},function(err,numAffected){
		if(err) cb(err);
		if(numAffected==0) cb('{error:1}');
		cb();
	});
}

exports.findAllPage=function(pageParam,cb){
	pageParam.sort={'reg_date':-1};
	page.pageQuery2(accountDao,{},pageParam,cb);
}

exports.findById=function(id,cb){
	accountDao.findOne({"_id":id},cb);
}

//Test Code
function testAdd(cb){
	var account={
		email:'xiayuanfeng@gmail.com',
		password:CryptoJS.MD5('xia1983')+"",
		reg_date:new Date(),
		exp_date:moment().add('years',1),
		role:1,
		status:accountDao.ACTIVE
	};
	exports.add(account,function(err,data){
		cb();
	});
}

function testLogin(cb){
	exports.login('xiayuanfeng@gmail.com','xia1983',function(account){
		console.log(account);
		cb(account);
	});
}

//Run Test Code
// testAdd(function(){
// });

// testLogin(function(){});

// exports.findById('5296ab15dbdd4e141d000001',function(err,account){
// 	console.log(account);
// });

// var pageParam={
// 	"iDisplayStart":0,
// 	"iDisplayLength":20
// }
// exports.findAllPage(pageParam,function(err,page){
// 	console.log(page);
// });

// exports.updatePasswordById('52a1768bfee2027404000001','456456',function(err){
// 	console.log(err);
// });


