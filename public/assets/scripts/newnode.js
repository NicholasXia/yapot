var Node = {
    init:function(){
        Node.event.loadPage(function(){
            Node.event.clickChannel(function(){
                Node.event.clickAddArticle(function(){

                });
                Node.event.clickDeleteArticle(function(){

                });
            });
        });
    },

    service:{
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
    },
    render:{
        //频道列表
        channelTree:function(cb){
            var DataSourceTree = function (options) {
                };
                DataSourceTree.prototype = {
                    data: function (options, callback) {
                        Node.service.getChannelTree(function(json){
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
                        var deleteButton="<a class='deleteArticle' nodeid=\""+data+"\" href=\"#\" class=\"btn default btn-xs black\"><i class=\"fa fa-trash-o\"></i> Delete</a>";
                        var updateButton="<a href=\"#\" class=\"btn default btn-xs purple\"><i class=\"fa fa-edit\"></i> Edit</a>";
                        var viewButton="<a href=\"#\" class=\"btn default btn-xs red-stripe\">View</a>";
                        return deleteButton+"&nbsp"+updateButton+"&nbsp"+viewButton;
                      }
                    }
                ]
                ,"aaSorting": [[1,'desc']]
            });
        }
    },

    event:{
        loadPage:function(cb){
            Node.render.channelTree(function(){
                cb();
            });
        },
        clickChannel:function(cb){
            console.log(window.toastr);
            var lastSelect=null;
            $(".tree-item-name").live('click',function(){
                if(lastSelect!=null){
                    $(lastSelect).css('font-weight','normal');
                }
                $(this).css('font-weight','bold');
                lastSelect=this;
                var channelStr=$(this).find('info').attr('val');
              
                Node.render.nodeList(channelStr);
                cb();
            });
        },
        clickAddArticle:function(cb){
            $("#idAddArticle").live('click',function(){
                var output = Mustache.render($("#idAddArticleTpl").html(), {});
                $("#idInfo").html(output);

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
                    toastr.success('添加成功');
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
                Node.service.saveArticle(params,function(){

                    Node.render.nodeList(channelStr);
                    cb();
                })  
             })
        },
        clickDeleteArticle:function(cb){
            $(".deleteArticle").live('click',function(){
                Node.service.deleteArticle({'id':$(this).attr("nodeid")},function(err){
                    if(err){
                        toastr.error('删除失败','系统级别错误，联系管理员');
                    }else{
                        toastr.success('删除成功');
                        var channelStr=$("#idAddArticle").attr('channel');
                        // render.nodeList(channelStr);
                    }
                    
                });
            });
            cb();
        }
    }

}