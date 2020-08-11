//jshint esversion:6

Array.prototype.forEach.call(document.querySelectorAll('.fileButton'), function(button) {
  const hiddenInput = button.parentElement.querySelector('#fileInput');
  let label = button.parentElement.querySelector('.fileLabel');
  const defaultText = "No file selected";
  label.textContent = defaultText;
  button.addEventListener('click', function(e) {
    e.preventDefault();
    hiddenInput.click();
  });
  hiddenInput.addEventListener('change', function() {
    const newText = "1 file selected";
    label.textContent = '1 file selected';
  });
});

var noPic = true;

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var nextPic;
    var currentPic;
    currentPic = parseInt(input.className[4]);
    nextPic = parseInt(input.className[4]) + 1;
    reader.onload = function(e) {
      if (noPic) {
        $('#cover-pic')
          .attr('src', e.target.result)
          .width(300)
          .height(300)
          .css('border', '5px solid grey');
        noPic = false;
      }
      $('#' + input.className)
        .attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    $('.vis' + nextPic).removeClass('vis' + nextPic);
    $('#plus' + currentPic).css('display', 'none');
    $('#cross' + currentPic).css('display', 'inline-block');
  }
}

$('.Img').click(function() {
  var coverPic = $(this).attr('src');
  if (coverPic != '/images/Imagehere.jpg') {
    $('#cover-pic')
      .attr('src', coverPic)
      .width(300)
      .height(300)
      .css('border', '5px solid grey');
  }
});

$('.fa-times').click(function() {
  var currentCross = $(this).attr('id')[5];
  var imageValue = $('#blah' + currentCross).attr('src');
  var coverPicValue = $('#cover-pic').attr('src');
  if (imageValue == coverPicValue) {
    $('#cover-pic').attr('src', '');
  }
  $('#cross' + currentCross).css('display', 'none');
  $('#plus' + currentCross).css('display', 'inline-block');
  $('#blah' + currentCross).attr('src', '/images/Imagehere.jpg');
});

var URL = "https://bechdaal.tech/category";
var selectedcategory;
$('#category').on('change', function() {
  selectedcategory = $('#category').find(":selected").text();
  $('#subcategory option').remove();
  if ($('#category').find(":selected").val() === 'none') {
    $('#subcategory').append("<option value='none'>-------------</option>");
  } else {
    $.ajax({
      url: URL,
      method: "GET"
    }).done(catagories => {
      catagories.forEach(category => {
        if (category.name === selectedcategory) {
          category.subcategory.forEach(subcategory => {
            $('#subcategory').append('<option value="' + subcategory + '">' + subcategory + '</option>');
          });
        }
      });
    }).fail(function() {
      alert('FAIL!!');
    });
  }
});
$.ajax({
  url: URL,
  method: "GET"
}).done(function(catagories) {
  catagories.forEach(category => {
    $('#category').append('<option value="' + category.name + '">' + category.name + '</option>');
  });
}).fail(function() {
  alert('FAIL!!');
});
