var ReplyKeywords=function(){
	var addArticleTB;
	var pagerSelect;
	var ds={
		selectArticleAry:[]
	}
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
			var $articleReplies=$form.find('.clsArticle .media-heading');
			var $garticleReplies=$form.find('.clsgArticle');
			var $channelReplies=$form.find('.clsChannel .media-heading');
			var $pageReplies=$form.find('.clsPage .media-heading');
			var $pageGroupReplies=$form.find('.clsPageGroup');
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
			//文字回复
			for(var i=0;i<$wordReplies.size();i++){
				var reply={};
				reply.rtype=1;
				reply.word={
					content:$wordReplies.eq(i).text()
				};
				replies.push(reply);
			}
			
			//文章回复
			for(var i=0;i<$articleReplies.size();i++){
				var reply={};
				reply.rtype=2;
				reply.node={
					node_id:$articleReplies.eq(i).attr('articleid'),
					title:$articleReplies.eq(i).text()
				};
				replies.push(reply);
			}

			//页面回复
			for(var i=0;i<$pageReplies.size();i++){
				var reply={};
				reply.rtype=5;
				reply.page={
					page_id:$pageReplies.eq(i).attr('pageid'),
					name:$pageReplies.eq(i).text()
				};
				replies.push(reply);
			}

			//一组页面回复
			for(var i=0;i<$pageGroupReplies.size();i++){
				var reply={};
				reply.rtype=6;
				reply.gpage={page:[]};
				var $pages=$pageGroupReplies.eq(i).find('.media-heading');
				for(var j=0;j<$pages.size();j++){
					var page={
						page_id:$pages.eq(j).attr('pageid'),
						name:$pages.eq(j).text()
					};
					reply.gpage.page.push(page);
				}
				replies.push(reply);
			}

			//一组文章回复
			for(var i=0;i<$garticleReplies.size();i++){
				var reply={};
				reply.rtype=3;
				reply.gnode={node:[]};
				var $articles=$garticleReplies.eq(i).find('.media-heading');
				for(var j=0;j<$articles.size();j++){
					var node={
						node_id:$articles.eq(j).attr('articleid'),
						title:$articles.eq(j).text()
					};
					reply.gnode.node.push(node);
				}
				replies.push(reply);
			}

			//频道回复

			for(var i=0;i<$channelReplies.size();i++){
				var reply={};
				reply.rtype=4;
				reply.channel={
					name:$channelReplies.eq(i).attr('channelname'),
					channel_id:$channelReplies.eq(i).attr('channelid'),
					num:$channelReplies.eq(i).attr('num')
				}
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
		},
		findAllChannels:function(cb){
			$.ajax({
                type: "GET",
                url: "/cms/channel/ajGetAll",
              
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                    cb({'error':1});
                },
                success: function(channels){
                    console.log(channels);
                    cb(channels);
                   
                }
            });
		},
		findAllPages:function(cb){
			$.ajax({
                type: "GET",
                url: "/cms/pager/ajGetByWebsiteId",
              
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                    cb({'error':1});
                },
                success: function(pagers){
             
                    cb(pagers);
                   
                }
            });
		},
		
		clsAddArticleModal:function(){
			$("#idAddArticleModal .clsChannel option").eq(0).attr('selected','selected');
			ds.selectArticleAry=[];
			render.articleTable('');
			$("#idAddArticleModal .clsArticles").select2("data",ds.selectArticleAry);
		},
		deleteRule:function(ruleId,cb){
			
			if(ruleId){
				$.ajax({
	                type: "GET",
	                url: "/wx/reply/ajDeleteRule",
	              	data:{ruleid:ruleId},
	                dataType: "json",
	                beforeSend:function(){
	                    
	                },
	                error: function(jqXHR, textStatus, errorThrown){
	                    cb({'error':1});
	                },
	                success: function(suc){  
	                    cb(suc);
	                   
	                }
            	});
			}else{
				cb();
			}
			
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
		addTmpPages:function(pages,$wordWrapObj){
			var output= Mustache.render($("#idRulePage").html(), {pages:pages});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
			//$wordWrapObj.html(output);
		},
		addTmpPagesGroup:function(pages,$wordWrapObj){
			var output= Mustache.render($("#idRulePageGroup").html(), {pages:pages});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
			//$wordWrapObj.html(output);
		},

		addTmpArticle:function(articles,$wordWrapObj){
			var output= Mustache.render($("#idRuleArticle").html(),{articles:articles});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
			//$wordWrapObj.html(output);
		},
		addTmpArticleGroup:function(articles,$wordWrapObj){
			var output= Mustache.render($("#idRuleArticleGroup").html(),{articles:articles});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
			//$wordWrapObj.html(output);
		},
		addTmpChannel:function(channel,$wordWrapObj){
			var output= Mustache.render($("#idRuleChannel").html(),{channel:channel});
			$wordWrapObj.find(".form-control-static").html('');
			$(output).hide().prependTo($wordWrapObj).slideDown("slow");
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
		},
		channelSelect:function(idModal,cb){
			service.findAllChannels(function(channels){
				var $selectObj=$("#"+idModal+" .clsChannel");

				$selectObj.html('<option>请选择频道</option>');
				for(var i=0;i<channels.length;i++){
					$selectObj.append('<option value="'+channels[i]._id+'">'+channels[i].name+'</option>');
				}
				cb();
			});
		},
		pageSelect:function(cb){
			service.findAllPages(function(pages){
				var $selectObj=$("#idAddPageModal .clsPage");

				$selectObj.html('');
				var pagers=[]
				// pagers.push({id:'',text:'请选择页面'});
				for(var i=0;i<pages.length;i++){
					// var pager={}
					// pager.id=pages[i]._id;
					// pager.text=pages[i].name;
					// pagers.push(pager);
					$selectObj.append('<option value="'+pages[i]._id+'">'+pages[i].name+'</option>');
				}
	
				$("#idAddPageModal .clsPage").select2({placeholder:'请选择页面'});
				// $selectObj.select2('data',pagers);
				cb();
			});
		},
		articleTable:function(channelId){
			
			if(ReplyKeywords.addArticleTB){

				ReplyKeywords.addArticleTB.fnDestroy();
				
			}
			ReplyKeywords.addArticleTB=$('#idAddArticleModal .clsArticleTB').dataTable({
               "bProcessing": true,
                "bFilter": true,
                "bServerSide": false,
                "sAjaxSource": "/cms/node/ajList?channelId="+channelId,
                "aoColumns": [
                  
                    { "mData": "_id",
                      "mRender":function(data,type,full){
                       
                        return "<input type='checkbox' title='"+full.viewTitle+"' value='"+data+"'/>";
                      }
                    },
                     { "mData": "viewTitle"},
                    { "mData": "viewCreateDate" }
                ]
                ,"aaSorting": [[2,'desc']]
            });
		},
		articlesSelect:function(){
			$(".clsArticles").select2(
			{ 

			});
		}
	};
	var event={
		pageLoad:function(cb){	
			render.rulesList(function(){//初始化RULE
				service.init();//初始化关键词控件
				render.pageSelect(function(){
				});
				cb();
			});
			
		},
		clickAddRule:function(){
			$("#idAddBT").click(function(){
				render.addNewRule();//添加一个区块
				event.clickAddWord();
				event.clickAddArticle();
				event.clickAddChannel();
				event.clickSaveRule();
				event.clickRemoveRule();
			});
		},
		clickAddWord:function(){
			$(".clsAddWordBT").die().live('click',function(){
				$("#idAddWordModal").modal('show');
				
				event.saveTmpWord($(this));
			});
		},
		clickAddArticle:function(){
			
			$(".clsAddAritcleBT").die().live('click',function(){
				service.clsAddArticleModal();
				$("#idAddArticleModal").modal('show');
				render.articlesSelect();
				render.channelSelect('idAddArticleModal',function(){
					event.changeChannel();
				});
				event.saveTmpArticle($(this));
			});
			
		},
		clickAddChannel:function(){
			
			$(".clsAddChannelBT").die().live('click',function(){
				
				$("#idAddChannelModal").modal('show');

				render.channelSelect('idAddChannelModal',function(){
					
				});
				event.saveTmpChannel($(this));
			});
			
		},
		clickAddPage:function(){		
			$(".clsAddPageBT").die().live('click',function(){				
				$("#idAddPageModal").modal('show');

				event.saveTmpPage($(this));
			});	
		},
		saveTmpArticle:function($formObj){
			$("#idAddArticleModal .clsTmpSaveBT").die().live('click',function(){
				var articleWrapObj=$formObj.closest('.form-body').find('.media-list');
				if($("#idGroupCK").attr("checked")){
					render.addTmpArticleGroup(ds.selectArticleAry,articleWrapObj);
				}else{
					render.addTmpArticle(ds.selectArticleAry,articleWrapObj);
				}
				
			});
		},
		saveTmpChannel:function($formObj){
			$("#idAddChannelModal .clsTmpSaveBT").die().live('click',function(){
				var articleWrapObj=$formObj.closest('.form-body').find('.media-list');
				var $channelOption= $("#idAddChannelModal .clsChannel").find("option:selected");
				var $articleOption= $("#idAddChannelModal .clsArticles").find("option:selected");
				var channel={
					id:$channelOption.val(),
					name:$channelOption.text(),
					num:$articleOption.text()
				}
				console.log(channel);
				render.addTmpChannel(channel,articleWrapObj);	
			});
		},	
		saveTmpWord:function($formObj){
			$("#idAddWordModal .clsTmpSaveBT").die().live('click',function(){
				var wordWrapObj=$formObj.closest('.form-body').find('.media-list');
				render.addTmpWord($(this).closest('.modal-body').find('textarea').val(),wordWrapObj);
			});
		},
		saveTmpPage:function($formObj){
			$("#idAddPageModal .clsTmpSaveBT").die().live('click',function(){
				var wordWrapObj=$formObj.closest('.form-body').find('.media-list');
				var $selectOpts=$(this).closest('.modal-body').find('.clsPage option:selected');
				var pages=[];
				for(var i=0;i<$selectOpts.size();i++){

					var page={
						id:$selectOpts.eq(i).val(),
						name:$selectOpts.eq(i).text()
					}
					pages.push(page);
				}
				if($("#idPagerCK").attr("checked")){
					render.addTmpPagesGroup(pages,wordWrapObj);
				}else{
					render.addTmpPages(pages,wordWrapObj);
				}
				
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

		},
		changeChannel:function(){
			$("#idAddArticleModal .clsChannel").die().live('change',function(){
				var channalId=$(this).val();
				render.articleTable(channalId);
				event.clickSelectArticle();
			});
		},
		clickSelectArticle:function(){
			$("#idAddArticleModal .clsArticleTB input[type='checkbox']").die().live('click',function(){
				var articleId=$(this).val();
				var title=$(this).attr('title');
				ds.selectArticleAry.push({id:articleId,text:title});
				$("#idAddArticleModal .clsArticles").select2("data",ds.selectArticleAry);

			});
		},
		clickRemoveRule:function(){
			$(".clsRemove").die().click(function(){
				var delRuleId=$(this).closest('form').find('input[name="id"]').val();
				$("#idRemoveModal").modal('show');
				$("#idRemoveBT").attr('ruleid',delRuleId);
				event.clickDeleteRule($(this).closest('.clsRule'));
			});
		},
		clickDeleteRule:function($deletRule){
			$("#idRemoveBT").die().live('click',function(){
				$("#idRemoveModal").modal('hide');
				$deletRule.slideUp('slow');
				service.deleteRule($(this).attr('ruleid'),function(){
					toastr.success('成功', '删除规则成功！'); 
				});
			});
		}
	};
	return {
		init:function(){
			event.pageLoad(function(){

				event.clickAddRule();
				event.clickAddWord();
				event.clickAddArticle();
				event.clickAddChannel();
				event.clickAddPage();
				event.delTmpWord();
				event.clickSaveRule();
				event.clickRemoveRule();
				
			});
		}
	}
}();