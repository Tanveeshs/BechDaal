//jshint esversion:6

function isEmail(email) {
  var regex1 = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return regex1.test(email);
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
      if (isEmail(elem.val())) {
        $('.mail-check').css('visibility', 'visible');

      } else {
        $('.mail-check').css('visibility', 'hidden');
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
