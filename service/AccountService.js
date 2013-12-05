var accountDao=require('../model/Account');
var CryptoJS = require("crypto-js");
var moment = require('moment');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//添加一个账号
exports.add=function(user,cb){
	
	function cbSave(err,data){
		cb(err,data);
	}
	accountDao.create(user,cbSave);
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