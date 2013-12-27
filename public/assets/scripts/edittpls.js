var Edittpls=function(){
	var service={};
	var render={
		tplsTree:function(cb){
			$("#idTplTree").jstree({
	        	"themes" : {
	            "icons" : false
	        	},

	        	"json_data" : {
		            "ajax" : {
		                "url" : "/cms/tpls/ajGetTree"
		       		}
	        	},

	        	"plugins" : [  "themes","json_data","ui","crrm","cookies","dnd","search","types","hotkeys"]
 			})
        	.bind("loaded.jstree", function (event, data) {
        		cb();
        	 })
            .bind("create.jstree", function (e, data) {

            })

			.one("reopen.jstree", function (event, data) { })
			.one("reselect.jstree", function (event, data) {})
			.bind("select_node.jstree", event.selectMenuTree)
			.bind("remove.jstree", function (e, data) {
			

    		});

			

			// menuTree= jQuery.jstree._reference("#idMenuTree");

			
		}
	};
	var event={
		pageLoad:function(cb){
			render.tplsTree(function(){
				cb();
			});
		}
	};
	return {
		init:function(){
			event.pageLoad(function(){

			});
		}
	}
}();