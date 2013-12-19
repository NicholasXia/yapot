var Node = function () {
    var service={
        getChannelTree:function(cb){
            $.getJSON('/cms/channel/ajGetTree?'+Math.random(),function(json){
                cb(json);
            }); 
        },
        saveArticle:function(params,cb){
            $.ajax({
                type: "POST",
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
        saveVideo:function(params,cb){
            $.ajax({
                type: "POST",
                url: "/cms/node/ajAddVideo",
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
        },
        getNodeById:function(nodeid,cb){
             $.getJSON('/cms/node/ajGetById',{nodeid:nodeid},function(json){
                cb(json);
             });
        },
        updateArticle:function(form,cb){
            var form = $(form);
           // $.getJSON('/cms/node/ajUpdateArticle',form.serialize(),function(json){
           //     cb(json);
           // });
            
            $.ajax({
                type: "POST",
                url: "/cms/node/ajUpdateArticle",
                data: form.serialize(),
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(json){
                   
                   cb(json);
                   
                }
             });
            
        },
        updateVideo:function(form,cb){
            var form = $(form);
           // $.getJSON('/cms/node/ajUpdateVideo',form.serialize(),function(json){
           //     cb(json);
           // });
            
            $.ajax({
                type: "POST",
                url: "/cms/node/ajUpdateVideo",
                data: form.serialize(),
                dataType: "json",
                beforeSend:function(){
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                   
                     cb({'error':1});
                },
                success: function(json){
                   
                   cb(json);
                   
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
                        var updateButton="<a href='javascript:;' nodeid=\""+data+"\" class='btn default btn-xs updateNode' href=\"#\" class=\"btn default btn-xs purple\"><i class=\"fa fa-edit\"></i> 更新</a>";
                        var viewButton="<a href=\""+articleUrl+"\" target=\"_blank\" class=\"btn default btn-xs red-stripe\">预览</a>";
                        return deleteButton+"&nbsp"+updateButton+"&nbsp"+viewButton;
                      }
                    }
                ]
                ,"aaSorting": [[1,'desc']]
            });
        },
        updateArticle:function(node,cb){
            var output = Mustache.render($("#idUpdateArticleTpl").html(), node);
            $("#idUpdateArticleModal render").html(output);
            // $("#idUpdateArticleModal .content").wysihtml5();
            var editor = new UE.ui.Editor();
                editor.render("idUpdateArticleContent");



            $("#idUpdateArticleModal").modal('show');
            $('#idUpdateArticleModal .clsfileupload').fileupload({
                    dataType: 'json',
                    done: function (e, data) {
                        $.each(data.result.files, function (index, file) {//
                            $("#idUpdateArticleModal .imageSrc").attr("src",file.url);
                            $("#idUpdateArticleModal .imageHidden").val(file.url);
                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#idUpdateArticleModal .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                        $('#idUpdateArticleModal .progress-bar').attr(
                            'aria-valuenow',
                            progress
                        );
                    }
                });

            event.clickSaveUpdateArticle(function(){
                cb();
            });
            
        },
        updateVideo:function(node,cb){
            var output = Mustache.render($("#idUpdateVideoTpl").html(), node);
            $("#idUpdateVideoModal render").html(output);
            // $("#idUpdateVideoModal .content").wysihtml5();
             var editor = new UE.ui.Editor();
                editor.render("idUpdateVideoContent");
            
            $("#idUpdateVideoModal").modal('show');
            $('#idUpdateVideoModal .clsfileupload').fileupload({
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {//
                        $("#idUpdateVideoModal .imageSrc").attr("src",file.url);
                        $("#idUpdateVideoModal .imageHidden").val(file.url);
                    });
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#idUpdateVideoModal .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                    $('#idUpdateVideoModal .progress-bar').attr(
                        'aria-valuenow',
                        progress
                    );
                }
            });

            event.clickSaveUpdateVideo(function(){
                cb();
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
            $(".tree-item-name").die().live('click',function(){
          
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
        clickAddVideo:function(cb){
            $("#idAddVideo").live('click',function(){
                var output = Mustache.render($("#idAddVideoTpl").html(), {});
                $("#idInfo").html(output);
                //富文本
                // $("#idVideoContent").markdown({autofocus:false,savable:false});
                // $('#idVideoContent').wysihtml5();
                var editor = new UE.ui.Editor();
                editor.render("idVideoContent");
                //文件上传
                $('#videofileupload').fileupload({
                    dataType: 'json',
                    done: function (e, data) {
                        $.each(data.result.files, function (index, file) {//
                            $("#idImageVideo").attr("src",file.url);
                            $("#idImageVideoHidden").val(file.url);
                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#idVideoProgressBar > .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                        $('#idVideoProgressBar > .progress-bar').attr(
                            'aria-valuenow',
                            progress
                        );
                    }
                });
                var channelStr=$(this).attr('channel');
                event.clickSaveVideo(channelStr,function(err){
                    $("#idError").hide();
                    $("#idSuccess >alert-heading").html("添加成功");
                    $("#idSuccess >p").html("保存文章成功");
                    $("#idSuccess").show();
                });
            });
            cb();
        },
        clickAddArticle:function(cb){
            $("#idAddArticle").die().live('click',function(){
                var output = Mustache.render($("#idAddArticleTpl").html(), {});
                $("#idInfo").html(output);
                //富文本
                // $("#idContent").markdown({autofocus:false,savable:false});
                // $('#idContent').wysihtml5();
                var editor = new UE.ui.Editor();
                editor.render("idContent");



                //文件上传
                $('#fileupload').fileupload({
                    dataType: 'json',
                    done: function (e, data) {
                        $.each(data.result.files, function (index, file) {//
                            $("#idImage").attr("src",file.url);
                            $("#idImageHidden").val(file.url);
                        });
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#idProgressBar > .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                        $('#idProgressBar > .progress-bar').attr(
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
        clickSaveVideo:function(channelStr,cb){
           
            var channelObj=jQuery.parseJSON(channelStr);
            var channelid=channelObj._id;
            $("#idSaveVideo").live('click',function(){
                var params={
                    channelId:channelid,
                    title:$("#idVideoTitle").val(),
                    content:$("#idVideoContent").val(),
                    videoUrl:$("#idVideoUrl").val(),
                    imgUrl:$("#idImageVideoHidden").val()
                }
                service.saveVideo(params,function(){

                    render.nodeList(channelStr);
                    cb();
                })  
             })
        },
        clickSaveArticle:function(channelStr,cb){
           
            var channelObj=jQuery.parseJSON(channelStr);
            var channelid=channelObj._id;
            $("#idSaveArticle").die().live('click',function(){
          
                var params={
                    channelId:channelid,
                    title:$("#idTitle").val(),
                    // content:$("#idContent").val(),
                    content:UE.getEditor('idContent').getContent(),
                    imgUrl:$("#idImageHidden").val()
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
        },
        clickUpdateArticle:function(cb){
            $(".updateNode").die().live('click',function(){
                service.getNodeById($(this).attr('nodeid'),function(node){
                   if(node.article.title){
                        render.updateArticle(node,function(){
                        });
                   }
                   if(node.video.title){
                        render.updateVideo(node,function(){
                        });
                   }
                });
            });
        },
        clickSaveUpdateArticle:function(cb){
            // $("#idUpdateArticleModal .saveArticle").click(function(){
                 $("#idUpdateArticleModal form").validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    ignore: "",
                    rules: {
                        title: {
                            required: true
                        },
                        content: {
                            required: true
                        }
                    },
                    messages: {
                        title: {
                            required: "图文标题不能为空"
                          
                        },
                        content: {
                            required: "图文正文不能为空"
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
                        service.updateArticle(form,function(num){
                            toastr.options =Config.toastrOpt;
                            toastr.success('成功', '修改文章成功！');   
                            $("#idUpdateArticleModal").modal('hide');
                        });
                    }
                });
                cb();
            // });
        },
        clickSaveUpdateVideo:function(cb){
            // $("#idUpdateArticleModal .saveArticle").click(function(){
                 $("#idUpdateVideoModal form").validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    ignore: "",
                    rules: {
                        title: {
                            required: true
                        },
                        content: {
                            required: true
                        },
                        url: {
                            required: true
                        }
                    },
                    messages: {
                        title: {
                            required: "图文标题不能为空"
                          
                        },
                        content: {
                            required: "图文正文不能为空"
                        },
                        url: {
                            required: "视频地址不能为空",
                            url:"视频地址格式不正确"
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
                        service.updateVideo(form,function(num){
                            toastr.options =Config.toastrOpt;
                            toastr.success('成功', '修改视频成功！');   
                            $("#idUpdateVideoModal").modal('hide');
                        });
                    }
                });
                cb();
            // });
        }
    }

    //公开方法
    return {
        //main function to initiate the module
        init: function () {
          
                event.loadPage(function(){
                    event.clickChannel(function(){
                        
                    });
                    event.clickAddArticle(function(){

                    });
                    event.clickAddVideo(function(){

                    });
                    event.clickDeleteArticle(function(){

                    });
                    event.clickUpdateArticle(function(){

                    });
                });
              
        }
    };

}();