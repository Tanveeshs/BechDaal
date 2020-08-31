let data;
let page = 0;
const main = document.querySelector(".mainContent");
$(document).ready(function () {
    $("#first").addClass('activeDot')
    $("#second").addClass('unactiveDot')
    $("#third").addClass('unactiveDot')
    for (var i = 0; i < 3; i++) {
        $("#cont").append("<div id='" + arr[i].id + "' class='one' onclick='editad1(this)'>\
        <form action='/search/main' method='post' id='form"+ arr[i].id + "'>\
        <input type='hidden' value='"+ arr[i].name + "' name='category'>\
        </form>\
            <img class='Img' src = '" + arr[i].img + "'> <br>\
              " + arr[i].name + "</div>")
    }
})
const first = document.querySelector("#first");
const second = document.querySelector("#second");
const third = document.querySelector("#third");
first.addEventListener('click', () => {
    $("#first").removeClass().addClass('activeDot')
    $("#second").removeClass().addClass('unactiveDot')
    $("#third").removeClass().addClass('unactiveDot')
    let s = [];
    ((arr.length < 3) ? (s = arr.slice(0, arr.length)) : (s = arr.slice(0, 3)))
    $("#cont").empty();
    for (let i = 0; i < 3; i++) {
        $("#cont").append(
            "<div id='" + s[i].id + "' class='one' onclick='editad1(this)'>\
          <form action='/search/main' method='post' id='form"+ s[i].id + "'>\
        <input type='hidden' value='"+ s[i].name + "' name='category'>\
        </form>\
            <img class='Img' src = '" + s[i].img + "'> <br>\
              " + s[i].name + "</div>")
    }

})
second.addEventListener('click', () => {
    if (arr.length <= 3) {
    } else {
        $("#first").removeClass().addClass('unactiveDot')
        $("#second").removeClass().addClass('activeDot')
        $("#third").removeClass().addClass('unactiveDot')
        let s;
        ((arr.length < 6) ? (s = [...arr.slice(3, arr.length)]) : (s = [...arr.slice(3, 6)]))
        $("#cont").empty();
        for (let i = 0; i < s.length; i++) {
            $("#cont").append(
                "<div id='" + s[i].id + "' class='one' onclick='editad1(this)'>\
            <form action='/search/main' method='post' id='form"+ s[i].id + "'>\
        <input type='hidden' value='"+ s[i].name + "' name='category'>\
        </form>\
            <img class='Img' src = '" + s[i].img + "'> <br>\
              " + s[i].name + "</div>")
        }
    }

})
third.addEventListener('click', () => {
    if (arr.length <= 6) {
    } else {
        $("#first").removeClass().addClass('unactiveDot')
        $("#second").removeClass().addClass('unactiveDot')
        $("#third").removeClass().addClass('activeDot')
        let s;
        ((arr.length < 9) ? (s = arr.slice(6, arr.length)) : (s = arr.slice(6, 9)))
        $("#cont").empty();
        for (let i = 0; i < s.length; i++) {
            $("#cont").append(
                "<div id='" + s[i].id + "' class='one' onclick='editad1(this)' >\
            <form action='/search/main' method='post' id='form"+ s[i].id + "'>\
        <input type='hidden' value='"+ s[i].name + "' name='category'>\
        </form>\
            <img class='Img' src = '" + s[i].img + "'> <br>\
              " + s[i].name + "</div>")
        }
    }

})


let page1 = -1;
$(function () {
    getNewAds()
});
function editad1(input) {
    var form = document.getElementById("form" + input.id);
    form.submit()
}
function convertTitle(title) {
    let newTitle;
    if (title.length > 17) {
        newTitle = title.slice(0, 17);
        newTitle = newTitle.concat('...')
        return newTitle
    }
    else {
        return title
    }
}
function getNewAds() {
    page1 = page1 + 1;
    $.ajax({
        url: "https://bechdaal.tech/sell/grid_ads/c/" + page1,
        method: "GET",
    }).done(function (ads) {
        ads.forEach(ad => {
            let date = new Date(ad.date_posted).toDateString()
            if (ad.isPaid === 2) {
                $("#locAds").append("<div class='two2' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<p class='featured' >FEATURED</p>" +
                    "<img class='images2' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para colorOrange' >₹" + ad.price + "</p>" +
                    "<p class='para'>" + convertTitle(ad.title) + "</p>" +
                    "<k style='font-size:large'>" + date + "</k>" +
                    "</form>" +
                    "</div>")
            } else {
                $("#locAds").append("<div class='two' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<img class='images' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para colorOrange'>₹" + ad.price + "</p>" +
                    "<p class='para'>" + convertTitle(ad.title) + "</p>" +
                    "<k style='font-size: large'>" + date + "</k>" +
                    "</form>" +
                    "</div>")
            }
        })
        wishlist.forEach((wish, i) => {
            if ($('#icon' + wish).length) {
                $('#icon' + wish).empty();
                $('#icon' + wish).append("<i id='red-" + wish + "' class='fa fa-heart icondisplay' aria-hidden='true' style='z-index: 10;color:orangered  ' onclick='event.stopPropagation();check(this)'></i>")
                delete wishlist[i]
            }
        })
        if(ads.length===0){
            $('#ShowMoreButton').css('display','none')
        }
    }).fail(function () {
        alert('FAIL!!');
    });
}


var state_arr = new Array("Mumbai");
var s_a = new Array();
s_a[0] = "";
s_a[1] = "Andheri(E)|Andheri(W)|Bandra(E)|Bandra(W)|Bhandup|Borivali(E)|Borivali(W)|Breach Candy|Byculla|Colaba|Cuffe Parade|Chembur|Churchgate|Charni Road|Dadar(E)|Dadar(W)|Dahisar|Dharavi|Deonar|Dongri|Elphinstone Road|Flora Fountain|Fort|Girgaum|Grant Road|Goregaon(E)|Goregaon(W)|Ghatkopar(E)|Ghatkopar(W)|Jogeshwari(E)|Jogeshwari(W)|Juhu|Kalbadevi|Kandivali(E)|Kandivali(W)|Khar(E)|Khar(W)|King's Circle|Kurla(E)|Kurla(W)|Lower Parel|Mazgaon|Mahim|Malabar Hill|Matunga|Marine Lines|Malad(E)|Malad(W)|Mulund(E)|Mulund(W)|Nariman Point|Parel|Prabhadevi|Peddar Road|Saki Naka|Santacruz(E)|Santacruz(W)|Sion|Tardeo|Trombay|Versova|Vile Parle(E)|Vile Parle(W)|Vidya Vihar|Vikhroli|Wadala|Worli";
function print_state1(state_id) {
    var option_str = document.getElementById(state_id);
    option_str.length = 0;
    option_str.options[0] = new Option('Select City', '');
    option_str.selectedIndex = 0;
    for (var i = 0; i < state_arr.length; i++) {
        option_str.options[option_str.length] = new Option(state_arr[i], state_arr[i]);
    }
}
function print_city1(city_id, city_index) {
    var option_str = document.getElementById(city_id);
    option_str.length = 0;
    // option_str.options[0] = new Option('Select Area', '');
    option_str.selectedIndex = 0;
    var city_arr = s_a[city_index].split("|");
    for (var i = 0; i < city_arr.length; i++) {
        option_str.options[option_str.length] = new Option(city_arr[i], city_arr[i]);
    }
}

print_state("sts1");



var showResults1 = debounce(function (arg) {
    var value = arg.trim();
    var jqxhr = $.post('/search/search/' + value, function (data) {
    }).done(function (data) {
        var ans = data
        console.log(ans)
        abc(ans)
    })
        .fail(function (err) {
            console.log(err);
        });
}, 100);

function abc(ans) {
    $("#menuSearch").autocomplete({
        source: ans
    });
}
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
