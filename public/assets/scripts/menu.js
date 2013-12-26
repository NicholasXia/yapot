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
			
		},
        findPagers:function(cb){
            $.ajax({
                type: "GET",
                url: "/cms/pager/ajGetByWebsiteId",        
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
            
        },
        updateMenu:function(form,cb){
            $.ajax({
                type: "GET",
                url: "/cms/menu/ajUpdate",
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
			
		},
        pagerSelect:function(pagers){
             $("#idPagerSelect").html("");
            if(pagers){
               
                for(var i =0 ;i<pagers.length;i++){
                    $("#idPagerSelect").append("<option value='"+pagers[i]._id+"'>"+pagers[i].name+"</option>");
                }
            }else{
                 $("#idPagerSelect").append("<option>没有页面</option>");
            }
           
            
        }
	};
	var event={
		clickSaveMenu:function(){

		},
		clickSaveLink:function(){
			$("#idSaveLinkBT").bind('click',function(){
                if($("#tab_1_1_1").hasClass('active')){
                    var channelName=$("#idChannelSelect > option:selected").text();
                    var channelEnglishName=$("#idChannelSelect > option:selected").val();
                    $("#idLinkText>p span").html(channelName);
                    $("#idLinkText input").val(channelEnglishName);
                    $("#idLinkType>p").html("频道链接");
                    $("#idLinkType input").val("1");
                   
                }else if($("#tab_1_1_2").hasClass('active')){
                    var pagerName =$("#idPagerSelect > option:selected").text();
                    var pagerId=$("#idPagerSelect > option:selected").val();
                    $("#idLinkText>p span").html(pagerName);
                    $("#idLinkText input").val(pagerId);
                    $("#idLinkType>p").html("页面链接");
                    $("#idLinkType input").val("2");
                }

                $("#idSelectLinkModal").modal('hide');
                

				
			});
		},

		clickSelectLink:function(cb){
			$("#idSelectLinkBT").die().live('click',function(){
				var menuinfo= JSON.parse($(this).attr('menuobj'));
				$("#idSelectLinkModal").modal('show');
				service.findChannels(function(channels){
					render.channelSelect(channels);
				});
                service.findPagers(function(pagers){
                    render.pagerSelect(pagers);
                });
                cb();
			});

		},

        clickSelectIcon:function(cb){
            $("#idSelectIconBT").die().live('click',function(){
                $("#idSelectIconModal").modal('show');
            });
           
        },

        clickSaveIcon:function(){
            $("#idSelectIconModal .fa-item").die().live('click',function(){
                var icon=$(this).find('i').attr('class');
       
                $("#idIconText").val(icon);
                $("#idIconI").attr('class',icon+" fa-2x");
                $("#idSelectIconModal").modal('hide');
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
                        form=$(form);

                        service.updateMenu(form,function(data){
                                toastr.success('成功', '更新菜单成功！');
                        });

                    }, 
                    invalidHandler: function(form, validator) {  //不通过回调 
                     return false; 
                    } 
                });
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
                   // $(form).submit();
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
                event.clickSelectIcon(function(){
                });
                event.clickSaveIcon();
				event.clickSaveLink();
			});
			
		}
	}
}();