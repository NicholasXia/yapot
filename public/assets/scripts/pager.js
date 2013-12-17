var Pager=function(){
	var pagerTree={};

	var service={
		deletePager:function(id,cb){
		
			$.ajax({
                type: "GET",
                url: "/cms/pager/ajDelete",
                data: {id:id},
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     toastr.error('失败', '删除页面失败，请联系管理员！');
                },
                success: function(data){
                   
                    toastr.options =Config.toastrOpt;
                    toastr.success('成功', '删除页面成功！');
                    cb();
                    $("#idRemoveModal").modal("hide");
                    //Channel.init();
                    // setTimeout('window.location=location;',1000);
                    
                }
            });

		},

		savePager:function(form,cb){
		var form = $(form);
            $.ajax({
                type: "GET",
                url: "/cms/pager/ajAdd",
                data: form.serialize(),
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     toastr.error('失败', '添加页面失败，请联系管理员！');
                },
                success: function(data){
                    $("#idAddModal").modal('hide');
                    toastr.options =Config.toastrOpt;
                    toastr.success('成功', '添加页面成功！');
                    cb();
                    //Channel.init();
                    // setTimeout('window.location=location;',1000);
                    
                }
            });
		},
		findById:function(id,cb){
			$.ajax({
                type: "GET",
                url: "/cms/pager/ajFindById",
                data: {id:id},
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   cb({});
                },
                success: function(data){
                   data.pagerObj=JSON.stringify(data);

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
        updatePager:function(form,cb){
            $.ajax({
                type: "GET",
                url: "/cms/pager/ajUpdate",
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

		pagerTree:function(cb){
			$("#idPagerTree").jstree({
	        	"themes" : {
	            "icons" : false
	        	},

	        	"json_data" : {
		            "ajax" : {
		                "url" : "/cms/pager/ajGetTree"
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
    			
				 service.deletePager(id,function(){

				 });

    		});

			

			pagerTree= jQuery.jstree._reference("#idPagerTree");

			cb();
		},
	
		pagerInfo:function(pager){
			var output = Mustache.render($("#idPagerInfoTpl").html(), pager);
			$("#idPagerInfoRender").html(output);
            // $("#idPagerInfoRender textarea").wysihtml5({"html": true});
		},
		channelSelect:function(channels){
			$("#idChannelSelect").html("");
			for(var i =0 ;i<channels.length;i++){
				$("#idChannelSelect").append("<option value='"+channels[i].englishname+"'>"+channels[i].name+"</option>");
			}
			
		}
	};
	var event={
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
			$("#idRemoveBT").die().live('click',function(){

				$("#idPagerTree").jstree("remove");
			});
			cb();
		},
		selectMenuTree:function(e,data){

			var id=$(data.rslt.obj[0]).attr('id');
			service.findById(id,function(pager){
				render.pagerInfo(pager);

                 $("#idEditForm").validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    ignore: "",
                    rules: {
                        name: {
                            required: true
                        },
                        content:{
                            required:true
                        }
                    },
                    messages: {
                        name: {
                            required: "页面名不能为空"
                        },
                        content: {
                            required: "网页内容不能为空"
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

                        service.updatePager(form,function(data){
                           render.pagerTree(function(){});
                                toastr.success('成功', '更新页面成功！');
                        });

                    }, 
                    invalidHandler: function(form, validator) {  //不通过回调 
                     return false; 
                    } 
                });
			});

		},

		pageLoad:function(cb){
			render.pagerTree(cb);
			$("#idAddForm").validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    name: {
                        required: true
                    },
                    content:{
                        required:true
                    }
                },
                messages: {
                    name: {
                        required: "页面名不能为空"
                      
                    },
                    content:{
                        required:"页面内容不能为空"
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
                	service.savePager(form,function(){
                		render.pagerTree(function(){});
                	});
 
                }
            });
            
           // $("#idAddForm .content").wysihtml5({"html": true});
      
			
		}
	};

	return {
		init:function(){
			event.pageLoad(function(){
				event.clickRemove(function(){
				});
				// event.clickSelectPager(function(){
				// });
				// event.clickSavePager();
			});
			
		}
	}
}();