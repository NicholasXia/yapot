var AdminAccount=function(){
	var accountTable={};

	var service={
		saveAccount:function(params,cb){
			$.ajax({
                type: "GET",
                url: "/cms/admin/account/ajAdd",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                	cb({'error':1});
                },
                success: function(data){
                    cb(null);
                }
            });
		},
		updatePassword:function(params,cb){
			$.ajax({
                type: "GET",
                url: "/cms/admin/account/ajUpdatePassword",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                	cb({'error':1});
                },
                success: function(data){
                	if(data){
                		cb({'error':1});
                	}
                	cb(null);
                    
                }
            });
			
		}
	};
	var render={
		accountListTable:function(cb){
			accountTable=$('#idAccountTable').dataTable({
               "bProcessing": false,
                "bFilter": false,
               
                // "bServerSide": true,
                "sAjaxSource": "/cms/admin/account/ajList",
                "aoColumns": [
                    { "mData": "email"},
                    { "mData": "role" },
                    { "mData": "name" },
                    { "mData": "reg_date" },
                    { "mData": "exp_date" },
                    { "mData": "status" },
                    { "mData": "_id",
                      "mRender":function(data,type,full){
                        var deleteButton="<a class='deleteArticle' nodeid=\""+data+"\" href=\"#\" class=\"btn default btn-xs black\"><i class=\"fa fa-trash-o\"></i> 删除</a>";
                        var updateButton="<a accountid=\""+data+"\" href=\"#\" class=\"alterBT btn default btn-xs purple\"><i class=\"fa fa-edit\"></i> 修改密码</a>";
                        return "&nbsp"+updateButton;
                      }
                    }
                ]
                ,"aaSorting": [[3,'desc']]
            });
			cb();
		},

		saveAccountMsg:function(err,cb){
			$('#idAddAccountModal').modal('hide');
			$("#idSuccessMsg").hide();
			$("#idErrorMsg").hide();

			if(err){
				$("#idErrorMsg > strong").html("保存失败");
				$("#idErrorMsg > span").html("保存失败,请联系管理员");
				$("#idErrorMsg").show();
				
			}else{
				$("#idSuccessMsg > strong").html("保存成功");
				$("#idSuccessMsg").show();
				accountTable.fnDraw();
			}
			cb();
			
		}
	};
	var event={
		pageLoad:function(cb){
			render.accountListTable(function(){
				cb();
			});
		},
		clickAddAccount:function(cb){
			$("#idAddAccountBT").click(function(){
				$('#idAddAccountModal').modal('show');
				var form1=$("#idAddAccountForm");
				var error1 = $('.alert-danger', form1);
            	var success1 = $('.alert-success', form1);

				form1.validate({
	                errorElement: 'span', //default input error message container
	                errorClass: 'help-block', // default input error message class
	                focusInvalid: false, // do not focus the last invalid input
	                ignore: "",
	                rules: {
	                    email: {
	                        required: true,
	                        email: true
	                    },
	                    password: {
	                        required: true
	                    },
	                    name:{
	                    	required:true
	                    },
	                    role: {
	                        required: true
	                    }
	                },
	                messages: {
		                email: {
		                    required: "邮箱不能为空",
		                    email:"邮箱格式不正确"
		                },
		                name: {
		                    required: "用户名不能为空",
		                },
		                password: {
		                    required: "密码不能为空"
		                }
	            	},

	                invalidHandler: function (event, validator) { //display error alert on form submit              
	                    success1.hide();
	                    error1.show();
	                    App.scrollTo(error1, -200);
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
	                    success1.show();
	                    error1.hide();
	                    service.saveAccount($(form).serialize(),function(err){
	                    	render.saveAccountMsg(err,function(){

	                    	});
	                    });
	                }
            	});


				cb();
			});
		},

		clickAlter:function(cb){
			$(".alterBT").live('click',function(){
				$("#idAlterPwdModal").modal('show');
				$("#idAccountIdHiden").val($(this).attr("accountid"));
				cb();
			});
		},
		clickUpdatePassword:function(cb){
			$("#idUpdatePwdBT").click(function(){
				service.updatePassword($("#idUpdatePwdForm").serialize(),function(err){
				
					$('#idAlterPwdModal').modal('hide');
					$("#idSuccessMsg").hide();
					$("#idErrorMsg").hide();

					if(err){
						$("#idErrorMsg > strong").html("保存失败");
						$("#idErrorMsg > span").html("保存失败,请联系管理员");
						$("#idErrorMsg").show();
					}else{
						$("#idSuccessMsg > strong").html("保存密码成功");
						$("#idSuccessMsg").show();
						accountTable.fnDraw();
					}
					cb();
				});
			});
			
		}
	};
	return {
		init:function(){
			event.pageLoad(function(){
				event.clickAddAccount(function(){//弹出添加MODAL
				
				});
				event.clickAlter(function(){
					event.clickUpdatePassword(function(){

					});
				});
			});
		}
	};
}();