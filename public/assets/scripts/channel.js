

var Channel = function () {

    return {
        //main function to initiate the module
        init: function () {
                
                 // $('#idChannelList').html('');
                var DataSourceTree = function (options) {
                  //  this._url  = options.url;

                };

                DataSourceTree.prototype = {
                  data: function (options, callback) {
                     $.getJSON('/cms/channel/ajGetTree?'+Math.random(),function(json){
                        callback({ data: json });
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

                // $('#tree-selected-items').on('click', function() {
                //     console.log("selected items: ", $('#idChannelList').tree('selectedItems'));
                // });
                // $('#idChannelList').on('selected',function(evt, data){
                //    console.log(data);

                // });

                // $('#idChannelList').on('loaded', function(evt, data) {
                //     console.log('tree content loaded');
                 
                // });

                // $('#idChannelList').on('opened', function(evt, data) {
                //     console.log('sub-folder opened: ', data);
                // });

                // $('#idChannelList').on('closed', function(evt, data) {
                //     console.log('sub-folder closed: ', data);
                // });
               
                Channel.selectChannel();
        },

        selectChannel:function(){
            var lastSelect=null;
            $(".tree-item-name").live('click',function(){
                if(lastSelect!=null){
                    $(lastSelect).css('font-weight','normal');
                }
                $(this).css('font-weight','bold');
                lastSelect=this;
                var channelStr=$(this).find('info').attr('val');
              
                var channelObj=jQuery.parseJSON(channelStr);
               
                var output = Mustache.render($("#idInfotpl").html(), channelObj);
                $("#idInfo").html(output);
            });
        },

        deleteChannel:function(id){
            
            $(".tree-item-name .tree-actions .fa-trash-o").live('click',function(){
                var id=$(this).attr('channelid');
                $.ajax({
                    type: "GET",
                    url: "/cms/channel/ajDelete",
                    data: {"id":id},
                    dataType: "json",
                    beforeSend:function(){
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                         toastr.error('失败', '删除失败，请联系管理员');
                    },
                    success: function(data){
                        $("#idAddModal").modal('hide');
                        toastr.options =Config.toastrOpt;
                        toastr.success('删除成功', '删除成功！');
                        
                        setTimeout('window.location=location;',1000);
                        
                    }
                });
            });
        },

        addChannel:function(){

            var ajAddChannel=function(form){
                var form = $(form);
                $.ajax({
                    type: "GET",
                    url: "/cms/channel/ajAdd",
                    data: form.serialize(),
                    dataType: "json",
                    beforeSend:function(){
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                         toastr.error('失败', '添加频道失败，请联系管理员！');
                    },
                    success: function(data){
                        $("#idAddModal").modal('hide');
                        toastr.options =Config.toastrOpt;
                        toastr.success('成功', '添加频道成功！');
                        //Channel.init();
                        setTimeout('window.location=location;',1000);
                        
                    }
                });
            }

            var form1 = $('#idAddForm');



             form1.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    english_channel: {
                        required: true
                    },
                    channel: {
                        required: true
                    }
                },
                messages: {
                    english_channel: {
                        required: "频道名不能为空"
                      
                    },
                    channel: {
                        required: "频道英文名不能为空"
                    }
                },

                // invalidHandler: function (event, validator) { //display error alert on form submit              
                //     success1.hide();
                //     error1.show();
                //     App.scrollTo(error1, -200);
                // },

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
                   ajAddChannel(form);
                }
            });
        }

    };

}();