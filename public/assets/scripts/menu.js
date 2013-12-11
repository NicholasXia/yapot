var Menu=function(){
	var menuTree={};

	var service={
		deleteMenu:function(id,cb){
			
			$.ajax({
                type: "GET",
                url: "/cms/menu/deleteParent",
                data: {id:id},
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     toastr.error('失败', '删除菜单失败，请联系管理员！');
                },
                success: function(data){
                   
                    toastr.options =Config.toastrOpt;
                    toastr.success('成功', '删除菜单成功！');
                    cb();
                    $("#idRemoveModal").modal("hide");
                    //Channel.init();
                    // setTimeout('window.location=location;',1000);
                    
                }
            });

		},

		saveMenu:function(form,cb){
		var form = $(form);
            $.ajax({
                type: "GET",
                url: "/cms/menu/addParent",
                data: form.serialize(),
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     toastr.error('失败', '添加菜单失败，请联系管理员！');
                },
                success: function(data){
                    $("#idAddModal").modal('hide');
                    toastr.options =Config.toastrOpt;
                    toastr.success('成功', '添加菜单成功！');
                    cb();
                    //Channel.init();
                    // setTimeout('window.location=location;',1000);
                    
                }
            });
		},
		findById:function(id,cb){
			$.ajax({
                type: "GET",
                url: "/cms/menu/ajFindById",
                data: {id:id},
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   cb({});
                },
                success: function(data){
                   data.menuobj=JSON.stringify(data);

                   cb(data);
                }
            });
		},
		findChannels:function(cb){
			$.ajax({
                type: "GET",
                url: "/cms/channel/ajGetAll",        
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

		menuTree:function(cb){
			$("#idMenuTree").jstree({
	        	"themes" : {
	            "icons" : false
	        	},

	        	"json_data" : {
		            "ajax" : {
		                "url" : "/cms/menu/ajGetTree"
		       		}
	        	},

	        	"plugins" : [  "themes","json_data","ui","crrm","cookies","dnd","search","types","hotkeys","contextmenu"]
 			})
        	.bind("loaded.jstree", function (event, data) { })
			.one("reopen.jstree", function (event, data) { })
			.one("reselect.jstree", function (event, data) {})
			.bind("select_node.jstree", event.selectMenuTree)
			.bind("remove.jstree", function (e, data) {
				 var id=$(data.rslt.obj[0]).attr('id');
    			
				 service.deleteMenu(id,function(){

				 });

    		});

			

			menuTree= jQuery.jstree._reference("#idMenuTree");

			cb();
		},
		/**
		* 没有菜单
		*/
		menuInfo:function(menu){
			var output = Mustache.render($("#idMenuInfoTpl").html(), menu);
			$("#idMenuInfoRender").html(output);
		},
		channelSelect:function(channels){
			$("#idChannelSelect").html("");
			for(var i =0 ;i<channels.length;i++){
				$("#idChannelSelect").append("<option value='"+channels[i].englishname+"'>"+channels[i].name+"</option>");
			}
			
		}
	};
	var event={
		clickSaveMenu:function(){

		},
		clickSaveLink:function(){
			$("#idSaveLinkBT").bind('click',function(){
				var channelName=$("#idChannelSelect > option:selected").text();
				var channelEnglishName=$("#idChannelSelect > option:selected").val();
				$("#idLinkText>p").html(channelName);
				$("#idLinkText>input").val(channelEnglishName);
				$("#idLinkType>p").html("频道链接");
				$("#idLinkType>input").val("1");
				$("#idSelectLinkModal").modal('hide');
			});
		},

		clickSelectLink:function(cb){
			$("#idSelectLinkBT").live('click',function(){
				var menuinfo= JSON.parse($(this).attr('menuobj'));
				$("#idSelectLinkModal").modal('show');
				service.findChannels(function(channels){
					render.channelSelect(channels);
					cb();
				});
			});
		},
		clickRemove:function(cb){
			$("#idRemoveBT").live('click',function(){
				$("#idMenuTree").jstree("remove");
			});
			cb();
		},
		selectMenuTree:function(e,data){
			var id=$(data.rslt.obj[0]).attr('id');
			service.findById(id,function(menu){
				render.menuInfo(menu);
			});
		},

		pageLoad:function(cb){
			render.menuTree(cb);
			$("#idAddForm").validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    menu_name: {
                        required: true
                    }
                },
                messages: {
                    menu_name: {
                        required: "菜单名不能为空"
                      
                    }
                },
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },
                submitHandler: function (form) {
                	service.saveMenu(form,function(){
                		render.menuTree(function(){});
                	});
                }
            });

			$("#idEditForm").validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    menu_name: {
                        required: true
                    }
                },
                messages: {
                    menu_name: {
                        required: "菜单名不能为空"
                      
                    }
                },
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },
                submitHandler: function (form) {
                	service.saveMenu(form,function(){
                		render.menuTree(function(){});
                	});
                }
            });
		}
	};

	return {
		init:function(){
			event.pageLoad(function(){
				event.clickRemove(function(){
				});
				event.clickSelectLink(function(){
				});
				event.clickSaveLink();
			});
			
		}
	}
}();