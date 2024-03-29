//jshint esversion:6

$(function() {
  $('#mul-select').selectpicker();
});

var areas = "Andheri(E)|Andheri(W)|Bandra(E)|Bandra(W)|Bhandup|Borivali(E)|Borivali(W)|Breach Candy|Byculla|Colaba|Cuffe Parade|Chembur|Churchgate|Charni Road|Dadar(E)|Dadar(W)|Dahisar|Dharavi|Deonar|Dongri|Elphinstone Road|Flora Fountain|Fort|Girgaum|Grant Road|Goregaon(E)|Goregaon(W)|Ghatkopar(E)|Ghatkopar(W)|Jogeshwari(E)|Jogeshwari(W)|Juhu|Kalbadevi|Kandivali(E)|Kandivali(W)|Khar(E)|Khar(W)|King's Circle|Kurla(E)|Kurla(W)|Lower Parel|Mazgaon|Mahim|Malabar Hill|Matunga|Marine Lines|Malad(E)|Malad(W)|Mulund(E)|Mulund(W)|Nariman Point|Parel|Prabhadevi|Peddar Road|Saki Naka|Santacruz(E)|Santacruz(W)|Sion|Tardeo|Trombay|Versova|Vile Parle(E)|Vile Parle(W)|Vidya Vihar|Vikhroli|Wadala|Worli";

var loc = areas.split("|");
loc.forEach((element) => {
  $('#mul-select').append('<option>' + element + '</option>');
});

const url = "https://bechdaal.tech/category";
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

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var nextPic;
    var currentPic;
    currentPic = parseInt(input.className[4]);
    nextPic = parseInt(input.className[4]) + 1;
    reader.onload = function(e) {
      if (currentPic == 0) {
        $('#cover-pic')
          .attr('src', e.target.result)
          .width(300)
          .height(300)
          .css('border', '5px solid grey');
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

$('.fa-times').click(function() {
  var currentCross = $(this).attr('id')[5];
  var imageValue = $('#blah' + currentCross).attr('src');
  var coverPicValue = $('#cover-pic').attr('src');
  if (imageValue == coverPicValue) {
    $('#cover-pic').attr('src', '');
  }
  $('#cross' + currentCross).css('display', 'none');
  $('#plus' + currentCross).css('display', 'inline-block');
  $('#blah' + currentCross).attr('src', 'https://storage.googleapis.com/bechdaal_bucket/assets/images/Imagehere.jpg');
  $('.vis' + currentCross).empty();
  $('.vis' + currentCross).append('<div style="position:relative"><input type="file" name="images" onchange="readURL(this);" id="fileInput"\
  hidden="hidden" class="blah' + currentCross + '"/><div style="position:absolute"><i id="cross' + currentCross + '" class="fas0 fa-times"></i>\
                    </div>\
                    <i id="plus' + currentCross + '" class="far fa-plus-square fileButton"></i><br>\
                    <img id="blah' + currentCross + '" class="Img" src="https://storage.googleapis.com/bechdaal_bucket/assets/images/Imagehere.jpg" alt="" /><br>\
                    <span class="fileLabel"></span></div>');
});
$.ajax({
  url: url,
  method: "GET"
}).done(function(catagories) {
  console.log(catagories)
  window.categoryarray = catagories;
  $('#category').empty();
  catagories.forEach(category => {
    $('#category').append('<option value="' + category.name + '">' + category.name + '</option>');
  });
  catagories[0].subcategory.forEach(subcat=>{
    $('#subcategory').append('<option value="' + subcat + '">' + subcat + '</option>');
  })
}).fail(function() {
  alert('FAIL!!');
});

var selectedcategory;
$('#category').on('change', function() {
  selectedcategory = $('#category').find(":selected").text();
  $('#subcategory option').remove();
  if ($('#category').find(":selected").val() === 'none') {
    $('#subcategory').append("<option value='none'>-------------</option>");
  } else {
    categoryarray.forEach(category => {
      if (category.name === selectedcategory) {
        category.subcategory.forEach(subcategory => {
          $('#subcategory').append('<option value="' + subcategory + '">' + subcategory + '</option>');
        });
      }
    });
  }
});
