
var page={
	"sEcho": 1,
	"iTotalRecords": 0,
	"iTotalDisplayRecords": 0,
	"aaData": []
}
var pageParam={
	"iDisplayStart":0,
	"iDisplayLength":20
}
exports.page=page;
exports.pageParam=pageParam;

exports.pageQuery2=function(dao,queryParam,pageParam,cb){

	function wcb(err,apps){
		if(err){
			cb({error:'system error'});
		}else if(apps==null){

			cb({error:'not find records'},page);
		}else{
			dao.find(queryParam).count(function(err,count){
				page.sEcho=pageParam.sEcho;
				page.iTotalRecords=1000;
				page.iTotalDisplayRecords=1000;
				page.aaData=apps;
				cb(err,page);
			});

			
		}
	}

	dao.find(queryParam).count(function(err,count){
		if(err){
			cb({error:'system error'});
		}else{
			if(!pageParam.sort){
				dao.find(queryParam).skip(pageParam.iDisplayStart).limit(pageParam.iDisplayLength).find().exec(wcb);
			}else{
				dao.find(queryParam).sort(pageParam.sort).skip(pageParam.iDisplayStart).limit(pageParam.iDisplayLength).exec(wcb);
			}
		}
	});
}

exports.pageQuery=function(query,pageParam,cb){
	var queryCount=query;
	function wcb(err,apps){
		if(err){
			cb({error:'system error'});
		}else if(apps==null){

			cb({error:'not find records'},page);
		}else{
			query.count(function(err,count){
				page.sEcho=pageParam.sEcho;
				page.iTotalRecords=1000;
				page.iTotalDisplayRecords=1000;
				page.aaData=apps;
				cb(err,page);
			});

			
		}
	}

	queryCount.count(function(err,count){
		if(err){
			cb({error:'system error'});
		}else{
			
			
	
				query.skip(pageParam.iDisplayStart).limit(pageParam.iDisplayLength).find().exec(wcb);
			
			

		}
	});
}