var Node = function () {
    var service={
        getChannelTree:function(cb){
            $.getJSON('/cms/channel/ajGetTree?'+Math.random(),function(json){
                cb(json);
            }); 
        },
        saveArticle:function(params,cb){
            $.ajax({
                type: "GET",
                url: "/cms/node/ajAddArticle",
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
        },
        deleteArticle:function(params,cb){
    
            $.ajax({
                type: "GET",
                url: "/cms/node/ajDeleteArticle",
                data: params,
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(err){
                   if(err){
                        cb({'error':1});
                    }else{
                        cb();
                    }
                    
                   
                }
             });
        }
    };
    var render={
        //频道列表
        channelTree:function(cb){
            var DataSourceTree = function (options) {
                };
                DataSourceTree.prototype = {
                    data: function (options, callback) {
                        service.getChannelTree(function(json){
                            callback({ data: json });
                            cb();
                        });
                    }
                };
                // INITIALIZING TREE
                var treeDataSource = new DataSourceTree({
                  // data: data
                });

                $('#idChannelList').tree({
                    dataSource: treeDataSource,
                    loadingHTML: '<img src="/assets/img/input-spinner.gif"/>',
                    cacheItems:false,
                    selectable: false
                });
            
                $('#idChannelList').on('loaded', function(evt, data) {
                $('.tree-actions').css('display','none');
            });
        },
        //文章列表
        nodeList:function(channelStr){
            var renderObj={'channelStr':channelStr};
            var channelObj=jQuery.parseJSON(channelStr);
            var output = Mustache.render($("#idInfotpl").html(), renderObj);
            $("#idInfo").html(output);
            $('#sample_1').dataTable({
               "bProcessing": false,
                "bFilter": true,
                
                // "bServerSide": true,
                "sAjaxSource": "/cms/node/ajList?channelId="+channelObj._id,
                "aoColumns": [
                    { "mData": "viewTitle"},
                    { "mData": "viewCreateDate" },
                    { "mData": "_id",
                      "mRender":function(data,type,full){
                        var articleUrl="/u/"+full.website_english_name+"/"+full.channel_english_name+"/"+full.id;
                        var deleteButton="<a class='deleteArticle' nodeid=\""+data+"\" href=\"#\" class=\"btn default btn-xs black\"><i class=\"fa fa-trash-o\"></i> 删除</a>";
                        var updateButton="<a href=\"#\" class=\"btn default btn-xs purple\"><i class=\"fa fa-edit\"></i> 更新</a>";
                        var viewButton="<a href=\""+articleUrl+"\" target=\"_blank\" class=\"btn default btn-xs red-stripe\">预览</a>";
                        return deleteButton+"&nbsp"+updateButton+"&nbsp"+viewButton;
                      }
                    }
                ]
                ,"aaSorting": [[1,'desc']]
            });
        }
    };

    var event={
        loadPage:function(cb){
            render.channelTree(function(){
                cb();
            });
        },
        clickChannel:function(cb){

            var lastSelect=null;
            $(".tree-item-name").live('click',function(){
                if(lastSelect!=null){
                    $(lastSelect).css('font-weight','normal');
                }
                $(this).css('font-weight','bold');
                lastSelect=this;
                var channelStr=$(this).find('info').attr('val');
              
                render.nodeList(channelStr);
                cb();
            });
        },
        clickAddArticle:function(cb){
            $("#idAddArticle").live('click',function(){
                var output = Mustache.render($("#idAddArticleTpl").html(), {});
                $("#idInfo").html(output);
                //富文本
                // $("#idContent").markdown({autofocus:false,savable:false});
                $('#idContent').wysihtml5();

                //文件上传
                $('#fileupload').fileupload({
                    dataType: 'json',
                    done: function (e, data) {
                        $.each(data.result.files, function (index, file) {//
                            $("#idImage").attr("src","/uploads/"+file.name);
                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#idProgressBar').css(
                            'width',
                            progress + '%'
                        );
                        $('#idProgressBar').attr(
                            'aria-valuenow',
                            progress
                        );
                    }
                });
                var channelStr=$(this).attr('channel');
                event.clickSaveArticle(channelStr,function(err){
                    $("#idError").hide();
                    $("#idSuccess >alert-heading").html("添加成功");
                    $("#idSuccess >p").html("保存文章成功");
                    $("#idSuccess").show();
                });
            });
            cb();
        },
        clickSaveArticle:function(channelStr,cb){
           
            var channelObj=jQuery.parseJSON(channelStr);
            var channelid=channelObj._id;
            $("#idSaveArticle").live('click',function(){
                var params={
                    channelId:channelid,
                    title:$("#idTitle").val(),
                    content:$("#idContent").val(),
                    imgUrl:$("#idImage").attr('src')
                }
                service.saveArticle(params,function(){

                    render.nodeList(channelStr);
                    cb();
                })  
             })
        },
        clickDeleteArticle:function(cb){
            $(".deleteArticle").live('click',function(){
                service.deleteArticle({'id':$(this).attr("nodeid")},function(err){
                    if(err){
                        $("#idSuccess").hide();
                        $("#idError >.alert-heading").html("删除文章失败");
                        $("#idError >p").html("删除文章失败");
                        $("#idError").show();
                    }else{
                        $("#idError").hide();
                        $("#idSuccess >.alert-heading").html("删除成功");
                        $("#idSuccess >p").html("删除文章成功");
                        $("#idSuccess").show();
                        var channelStr=$("#idAddArticle").attr('channel');
                        render.nodeList(channelStr);
                    }
                    
                });
            });
            cb();
        }
    }

    var aalert={
        onAlert:function(){
          
            $(".page-title").click(function(){
                toastr.success('dd','dd');
            });
        }
    }


    //公开方法
    return {
        //main function to initiate the module
        init: function () {
            aalert.onAlert();
                event.loadPage(function(){
                    event.clickChannel(function(){
                        event.clickAddArticle(function(){

                        });
                        event.clickDeleteArticle(function(){

                        });
                    });
                });
              
        }
    };

}();