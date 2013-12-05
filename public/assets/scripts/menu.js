var Menu=function(){
	var service={

	};
	var render={
		menuTree:function(cb){
			$("#idMenuTree").jstree({
	        	"themes" : {
	            "theme" : "apple",
	            "dots" : true,
	            "icons" : true
	        	},

	        	"json_data" : {
		            "ajax" : {
		                "url" : "/cms/menu/ajGetTree"
		       		}
	        	},

	        	"plugins" : [ "themes", "json_data" ,"ui"]
 			})
        	.bind("loaded.jstree", function (event, data) { })
			.one("reopen.jstree", function (event, data) { })
			.one("reselect.jstree", function (event, data) {})
			.bind("select_node.jstree", function (e, data) { 
				console.log(data);
				// alert($(data.rslt.obj[0]).attr('id'));
			});
			cb();
		}
	};
	var event={
		pageLoad:function(cb){
			render.menuTree(cb);
		}
	};

	return {
		init:function(){
			event.pageLoad(function(){

			});
		}
	}
}();