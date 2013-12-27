var Edittpls=function(){
	var service={

		selectByName:function(filename,cb){
			$.getJSON('/cms/tpls/ajGetByFileName',{filename:filename},function(file){
				cb(file)
			});
		},
		save:function(form,cb){
			 $.ajax({
                type: "POST",
                url: "/cms/tpls/ajSaveTpl",
                data:form.serialize(),        
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   cb({});
                },
                success: function(data){
                   cb(data);
                }
            });
			
		}
	};
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
			.bind("select_node.jstree", event.selectTplTree)
			.bind("remove.jstree", function (e, data) {
			

    		});

			

			// menuTree= jQuery.jstree._reference("#idMenuTree");

			
		},
		tplinfo:function(file){
			var output = Mustache.render($("#idHtmlTpl").html(), file);
			$("#idTplInfoRender").html(output);
		}
	};
	var event={
		pageLoad:function(cb){
			render.tplsTree(function(){
				cb();
			});
		},
		selectTplTree:function(e,data){

			var filename=$(data.rslt.obj[0]).attr('id');
			service.selectByName(filename,function(file){
				render.tplinfo(file);
			});
		},
		clickSave:function(cb){
			$("#idSaveForm button").die().live('click',function(){
				service.save($("#idSaveForm"),function(){
					toastr.success('', '保存成功...');
				});
				
			});
			cb();
		}
	};
	return {
		init:function(){
			event.pageLoad(function(){
				event.clickSave(function(){
					
				});
			});
		}
	}
}();