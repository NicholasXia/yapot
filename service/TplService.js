var fs =require('fs');
var ncp =require('ncp');
var async=require('async');
var websiteService = require('./WebsiteService');
exports.getAll=function(cb){
	var templates=[];
	var tplPath = __dirname.replace('service','')+'/templates/';
	fs.readdir(tplPath,function(err,folders){
		for(var i=0;i<folders.length;i++){
			var tpl={};
			var readme=fs.readFileSync(__dirname.replace('service','')+'/templates/'+folders[i]+"/readme.txt");
			tpl.readme=readme+"";
			tpl.imageurl="/"+folders[i]+"/screenshot.png";
			tpl.name=folders[i];
			templates.push(tpl);
		}
		cb(err,templates);
	});
}

// exports.getAll(function(err,templates){
// 	console.log(templates);
// });

exports.copyTplByNameAccount=function(name,accountId,fcb){


	var tplPath = __dirname.replace('service','')+'/templates/'+name;
	var desPathFile = __dirname.replace('service','')+'/views/users/'+accountId+"/"+name;
	var desPathFolder = __dirname.replace('service','')+'/public/users/'+accountId+"/skin/"+name;
	// if()
	if(fs.existsSync(desPathFile)){
		return fcb();
	}

	fs.mkdirSync(desPathFile);
	fs.mkdirSync(desPathFolder);
	
	fs.readdir(tplPath,function(err,files){
		async.eachSeries(files,function(file,cb){
			if(file.indexOf('ejs')!=-1){
				fs.createReadStream(tplPath+"/"+file).pipe(fs.createWriteStream(desPathFile+"/"+file));
				cb();
			}else{
				ncp.limit = 16;
			
				ncp(tplPath+"/"+file, desPathFolder+"/"+file, function (err) {
					cb(err);
				});
			}

		},function(err){
			fcb(err);
		});
	});
}

exports.getTplFileByAccountId=function(accountId,tplName,fileName,cb){
	var desPath=__dirname.replace('service','')+'/views/users/'+accountId+'/'+tplName+"/";
	var file={};
	fs.readFile(desPath+fileName, function (err, data) {
		file.tplname=tplName;
		file.name=fileName;
		file.content=data+"";
	  	cb(file);
	});	
}

exports.getTplsTreeByAccountId=function(accountId,tplName,cb){
	var desPath=__dirname.replace('service','')+'/views/users/'+accountId+'/'+tplName;
	fs.readdir(desPath,function(err,files){
		var trees=[];
		for(var i=0;i<files.length;i++){
			if(files[i].indexOf('ejs')!=-1){
				var tplsTree={
				'data':'',
				'attr':{}
				};
				tplsTree.data=files[i].replace('.ejs','');
				tplsTree.attr.id=files[i];
				trees.push(tplsTree);
			}
			
		}
		cb(trees);
	});
	
}

exports.saveTplByAccountId=function(accountId,tplname,filename,content,cb){
	var fliePath=__dirname.replace('service','')+'/views/users/'+accountId+'/'+tplname+"/"+filename;
	fs.writeFile(fliePath, content, function (err) {
	  cb({'ok':'ok'})
	});
}

// exports.getTplsTreeByAccountId('52bcf092db400bac36000001','ocean',function(tree){
// 	console.log(tree);
// });

// exports.getTplFileByAccountId('52bcf092db400bac36000001','ocean','index.ejs',function(file){
// 	console.log(file);
// });

// exports.copyTplByNameAccount('default','52aaa12e26ea200824000002',function(err){
// 	console.log(err);
// });

