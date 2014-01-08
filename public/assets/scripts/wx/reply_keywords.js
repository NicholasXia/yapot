var ReplyKeywords=function(){
	var service={
		init:function(){
			$(".clsKeywords").select2(
			{ tags: [],
			  placeholder:'按回车输入多个关键词',
			  createSearchChoice:function(term,data){
					return {id:term, text:term};
			  }
			});
			
		},
		saveRule:function($form,cb){
			var keywordsAry=$form.find('input[name="keywords"]').val().split(',');
			var $wordReplies=$form.find('.clsWord .media-heading');
			
			var keywordsObjs=[];
			var replies=[];
			var all=false;
			var id=$form.find('input[name="id"]').val();
			for(var i=0;i<keywordsAry.length;i++){
				var keywordsObj={};
				keywordsObj.name=keywordsAry[i];
				keywordsObj.match=true;
				keywordsObjs.push(keywordsObj);
			}
			
			for(var i=0;i<$wordReplies.size();i++){
				var reply={};
				reply.rtype=1;
				reply.word={
					content:$wordReplies.eq(i).text()
				};
				replies.push(reply);
			}
			if($form.find('input[name="rulename"]').val()=='true'){
				all=true;
			}
			var rule={
				name:$form.find('input[name="rulename"]').val(),
				all:all,
				keywords:keywordsObjs,
				replies:replies
			}
			var params={
				rule:rule,
				id:id
			}
			console.log(params);
			$.ajax({
                type: "POST",
                url: "/wx/reply/ajSaveRule",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(data){
                    console.log(data);
                    cb(data);
                   
                }
            });

			
		},
		findAll:function(cb){
			$.ajax({
                type: "GET",
                url: "/wx/reply/ajFindAll",
              
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(rules){
                    console.log(rules);
                    cb(rules);
                   
                }
            });
		}
	};
	var render={
		addNewRule:function(){
			var output = Mustache.render($("#idRuleTpl").html(), {});
			$(output).hide().prependTo("#idNewRuleRender").slideDown("slow");
			service.init();
		},
		addTmpWord:function(word,$wordWrapObj){
			var output= Mustache.render($("#idRuleWord").html(), {word:word});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
			//$wordWrapObj.html(output);
		},
		saveRule:function($form,rule){
			if(rule.error){
	   			toastr.options =Config.toastrOpt;
				toastr.error('失败', '保存规则失败！');  
			}else{
				toastr.success('成功', '保存规则成功！'); 
				console.log(rule); 
				console.log($form.find('.caption span'));
				$form.closest('.portlet').find('.caption span').html(rule.name);
				if(rule._id){
					$form.find('input[name="id"]').val(rule._id);
				}
				
			}
		},
		rulesList:function(cb){
			service.findAll(function(rules){

				var output= Mustache.render($("#idRuleListTpl").html(), {rules:rules});
				$(output).hide().prependTo("#idNewRuleRender").slideDown("slow");
				cb();
			});
		}
	};
	var event={
		pageLoad:function(cb){	
			render.rulesList(function(){//初始化RULE
				service.init();//初始化关键词控件

				cb();
			});
			
		},
		clickAddRule:function(){
			$("#idAddBT").click(function(){
				render.addNewRule();//添加一个区块
				event.clickAddWord();
				event.clickSaveRule();
			});
		},
		clickAddWord:function(){
			$(".clsAddWordBT").die().live('click',function(){
				$("#idAddWordModal").modal('show');
				
				event.saveTmpWord($(this));
			});
		},
		saveTmpWord:function($formObj){
			$(".clsTmpSaveBT").die().live('click',function(){
				var wordWrapObj=$formObj.closest('.form-body').find('.media-list');
				render.addTmpWord($(this).closest('.modal-body').find('textarea').val(),wordWrapObj);
			});
		},
		delTmpWord:function(){
			$(".clsTmpDelWord").die().live('click',function(){
				$(this).closest('li').slideUp('slow',function(){
					$(this).closest('li').remove();
				});
				
			});
		},
		clickSaveRule:function(){
			$(".clsRuleForm").validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    ignore: "",
                    rules: {
                        rulename: {
                            required: true
                        },
                        keywords: {
                            required: true
                        }
                    },
                    messages: {
                        rulename: {
                            required: "规则不能为空"
                          
                        },
                        keywords: {
                            required: "请填写关键词"
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
                     
                       service.saveRule($(form),function(data){
                       		render.saveRule($(form),data);
                       });
                    }
                });

		}
	};
	return {
		init:function(){
			event.pageLoad(function(){
				event.clickAddRule();
				event.clickAddWord();
				event.delTmpWord();
				event.clickSaveRule();
			});
		}
	}
}();