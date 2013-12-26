var Tpls=function(){
	var service={
		getAll:function(cb){
			$.ajax({
                type: "GET",
                url: "/cms/tpl/ajGetAll",
                // data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     cb({'error':1});
                },
                success: function(data){
                   cb(data);
                }
             });
		},
		selectTpl:function(params,cb){
			$.ajax({
                type: "GET",
                url: "/cms/tpl/ajSelectTpl",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                     cb({'error':1});
                },
                success: function(data){
                   cb(data);
                }
             });
		}
	};
	var render={
		list:function(tpls){
			var output=Mustache.render($("#idTplsTpl").html(),tpls);
			$("#idTplsRender").html(output);
		}
	};
	var event={
		/*cb 读取模板成功*/
		loadTpl:function(cb){
			service.getAll(function(tpls){
				render.list(tpls);
				cb();
			});
		},
		selectTpl:function(cb){
			$(".clsSelectTpl").live('click',function(){
				$(".thumbnail").css({"border":"1px solid #ddd"});
				$(this).closest(".thumbnail").css({"border":"2px solid red"});
				$(".clsSelectTpl").attr('disabled',"disabled");
				toastr.success('', '正在更换模版，请稍后...');
				var params={name:$(this).attr('tplname')};
				service.selectTpl(params,function(){
					toastr.success('', '模板更换成功');
					$("iframe").attr('src',$("iframe").attr('src'));
					cb();
					$(".clsSelectTpl").attr('disabled',false);
				});
				
			});
		}
	};

	return {
		init:function(){
			event.loadTpl(function(){
				event.selectTpl(function(){

				});
			});
		}
	}
}();