//jshint esversion:6

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
  const type = $('#password').attr('type') === 'password' ? 'text' : 'password';
  $('#password').attr('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});
