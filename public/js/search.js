//jshint esversion:6

$(document).ready(function() {
  $("#toggledown").click(function() {
    $("#search").slideToggle(300);
  });
});



var showResults = debounce(function(arg) {
  var value = arg.trim();
  if (value == "" || value.length <= 0) {
    $("#search-results").fadeOut();
    return;
  } else {
    $("#search-results").fadeIn();
  }
  var jqxhr = $.post('/search/search/' + value, function(data) {
      $("#search-results").html("");
    })
    .done(function(data) {
      var ans = data
      console.log(ans)
      abc(ans)

    })
    .fail(function(err) {
      console.log(err);
    });
}, 100);


function abc(ans){
    $( "#InputBar" ).autocomplete({
      source: ans
    });
}
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
