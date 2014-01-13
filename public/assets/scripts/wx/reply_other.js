var ReplyOther=function(){
	var service={
		saveWord:function(word,cb){
			var params={
				word:word
			};
			$.ajax({
                type: "POST",
                url: "/wx/reply/ajSaveOtherWord",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(data){
                   
                    cb();
                   
                }
            });
		}
	};
	var render={};
	var event={
		pageLoad:function(){
			
		},
		clickSaveWord:function(){
			$("#idSaveWordBT").click(function(){
				var word=$("#idWordText").val();
				service.saveWord(word,function(){
					toastr.options =Config.toastrOpt;
                    toastr.success('成功', '保存成功！');  
				});
			});
		}
	};
	return {
		init:function(){
			event.clickSaveWord();//保存关注文字
		}
	}
}();