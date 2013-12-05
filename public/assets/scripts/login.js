var Login = function () {

	var handleLogin = function() {

		// ajax login function to be called right after the form validation success
		var ajaxLogin = function(form) {
			form = $(form);
			$.ajax({
				type: "POST",
				url: "/ajLogin",
				data: form.serialize(),
				dataType: "json",
				beforeSend:function(){
					$('.alert-danger,.alert-success').hide();
				},
				error: function(jqXHR, textStatus, errorThrown){
					$('.alert-danger').show();
					$('.alert-danger span').html(errorThrown);
				},
				success: function(data){
					if(data.login!='ok'){
						$('.alert-danger').show();
						$('.alert-danger span').html("用户名或密码错误");
					}else{
						document.location='/cms/index';
					}		
				}
			});
		}

		$('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                email: {
	                    required: true,
	                    email:true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                email: {
	                    required: "邮箱不能为空",
	                    email:"邮箱格式不正确"
	                },
	                password: {
	                    required: "密码不能为空"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-danger', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                ajaxLogin(form); // form validation success, call ajax form submit
	            }
	        });

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                    ajaxLogin($('.login-form')); //form validation success, call ajax form submit
	                }
	                return false;
	            }
	        });
	}



	
    
    return {
        //main function to initiate the module
        init: function () {
            handleLogin();
        }

    };

}();