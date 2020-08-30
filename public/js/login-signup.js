//jshint esversion:6

$(function () {
    // alert("Hi");
  $('[data-toggle="popover"]').popover()
});

function isEmail(email) {
  var regex1 = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return regex1.test(email);
}

function isPhoneNo(number) {
  var regex2 = /^\d{10}$/;
  return regex2.test(number);
}

function isUsername(name) {
  var regex3 = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;
  return regex3.test(name);
}
$('.i-email').each(function() {
  var elem = $(this);
  elem.data('oldVal', elem.val());
  // Look for changes in the value
  elem.bind("propertychange change click keyup input paste", function(event) {
    if (elem.data('oldVal') === elem.val()) {
      $('.name-check').css('visibility', 'hidden');
    }
    // If value has changed...
    if (elem.data('oldVal') != elem.val()) {
      // Do action
      if (isEmail(elem.val()) || isPhoneNo(elem.val())) {
        $('.mail-check').css('visibility', 'visible');

      } else {
        $('.mail-check').css('visibility', 'hidden');
      }
    }
  });
});

$('#phone').each(function() {
  var elem = $(this);
  elem.data('oldVal', elem.val());
  // Look for changes in the value
  elem.bind("propertychange change click keyup input paste", function(event) {
    if (elem.data('oldVal') === elem.val()) {
      $('.name-check').css('visibility', 'hidden');
    }
    // If value has changed...
    if (elem.data('oldVal') != elem.val()){
      // Do action
      if (isPhoneNo(elem.val())) {
        $('.ph-check').css('visibility', 'visible');

      } else {
        $('.ph-check').css('visibility', 'hidden');
      }
    }
  });
});

$('.i-name').each(function() {
  var elem = $(this);
  elem.data('oldVal', elem.val());

  // Look for changes in the value
  elem.bind("propertychange change click keyup input paste", function(event) {
    if (elem.data('oldVal') === elem.val()) {
      $('.name-check').css('visibility', 'hidden');
    }
    // If value has changed...
    if (elem.data('oldVal') != elem.val()) {
      // Do action
      if (elem.val().length > 4) {
        $('.name-check').css('visibility', 'hidden');

        if (isUsername(elem.val())) {
          $('.name-check').css('visibility', 'visible');
        } else {
          $('.name-check').css('visibility', 'hidden');
        }
      } else {
        $('.name-check').css('visibility', 'hidden');
      }
    }
  });
});
$('#togglePass').click(function(e) {
  // toggle the type attribute
  const type = $('#password1').attr('type') === 'password' ? 'text' : 'password';
  $('#password1').attr('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

$("input[type=password]").keyup(function(){
    var ucase = new RegExp("[A-Z]+");
	var lcase = new RegExp("[a-z]+");
	var num = new RegExp("[0-9]+");

	if($("#password1").val().length >= 6){
		$("#6char").removeClass("fa-times");
		$("#6char").addClass("fa-check");
		$("#6char").css("color","#00A41E");
	}else{
		$("#6char").removeClass("fa-check");
		$("#6char").addClass("fa-times");
		$("#6char").css("color","#FF0004");
	}

	if(ucase.test($("#password1").val())){
		$("#ucase").removeClass("fa-times");
		$("#ucase").addClass("fa-check");
		$("#ucase").css("color","#00A41E");
	}else{
		$("#ucase").removeClass("fa-check");
		$("#ucase").addClass("fa-times");
		$("#ucase").css("color","#FF0004");
	}

	if(lcase.test($("#password1").val())){
		$("#lcase").removeClass("fa-times");
		$("#lcase").addClass("fa-check");
		$("#lcase").css("color","#00A41E");
	}else{
		$("#lcase").removeClass("fa-check");
		$("#lcase").addClass("fa-times");
		$("#lcase").css("color","#FF0004");
	}

	if(num.test($("#password1").val())){
		$("#num").removeClass("fa-times");
		$("#num").addClass("fa-check");
		$("#num").css("color","#00A41E");
	}else{
		$("#num").removeClass("fa-check");
		$("#num").addClass("fa-times");
		$("#num").css("color","#FF0004");
	}

    if ($("#password1").val() != "" || $("#password2").val() != "") {
        if ($("#password1").val() == $("#password2").val()) {
            $(".pass-check").css('visibility', 'visible');
            $("#signupBtn").attr('disabled', false);
        }
        else{
		$(".pass-check").css('visibility', 'hidden');
        // $("#signupBtn").Attr('disabled');

	}
}
});
$("#signupBtn").click(function(){
    if ($("#password1").val() != $("#password2").val()){
        alert("The passwords don't match");
        $("#signupBtn").attr('disabled', true);
    }

});
