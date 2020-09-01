let page = 0;
let sorting = 3;
$.ajax({
    url: 'https://bechdaal.tech/search/main',
    method: 'POST',
    data: {
        isAjax: '1',
        sorting: sorting,
        page: 0,
        searchInput: searchInput1,
        locality: locality,
        category: category
    }
}).done(function (result) {
    if (result.length > 0) {
        $('#content').empty()
        result.forEach(ad => {
            let date = new Date(ad.date_posted).toDateString()
            if (ad.isPaid === 2) {
                $("#content").append("<div class='two2' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<span class='featured' style='float: left' >FEATURED</span>" +
                    "<img class='images2' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para'>₹" + ad.price + "</p>" +
                    "<p class='para'>" + ad.title + "</p>" +
                    "<k style='font-size:large'>" + date + "</k>" +
                    "</form>" +
                    "</div>")
            } else {
                $("#content").append("<div class='two' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<img class='images' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para'>₹" + ad.price + "</p>" +
                    "<p class='para'>" + ad.title + "</p>" +
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

    } else {
        $('#content').empty()
        $('#content').append(`<div style="margin: 8% 0px" class='jumbotron'>No Ads Available for the filter</div>`)
            $('#ShowMoreButton').css('display','none')
    }
})

$.ajax({
    url: "https://bechdaal.tech/category",
    method: "GET",
}).done(function (resp) {
    let prevCat = category;
    resp.forEach(category => {
        if (category.name == prevCat) {
            $('#catInsert').append(`<a onclick="onClickCat(this)" id='cat${category.name}' class="active1">${category.name} </a>`)
        }
        else {
            $('#catInsert').append(`<a onclick="onClickCat(this)" id='cat${category.name}'>${category.name} </a>`)
        }
    })
})
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;
for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}
function editad1(input) {
    console.log(input)
    var form = document.getElementById("form" + input.id);
    form.submit()
}
function onClickCat(input) {
    $('#cat' + category).removeClass('active1');
    category = input.id;
    $('#' + category).addClass('active1');
    category = category.replace('cat', '')
    changeQuery();
}
function onChangeSort() {
    sorting = $('#sorting1').val()
    console.log()
    changeQuery();
}
function pageInc() {
    page = page + 1;
    fireQuery();
}
function changeQuery() {
    page = 0;
    $.ajax({
        url: 'https://bechdaal.tech/search/main',
        method: 'POST',
        data: {
            isAjax: '1',
            sorting: sorting,
            page: 0,
            searchInput: searchInput1,
            locality: locality,
            category: category
        }
    }).done(function (result) {
        if (result.length > 0) {
            $('#content').empty()
            result.forEach(ad => {
                let date = new Date(ad.date_posted).toDateString()
                if (ad.isPaid === 2) {
                    $("#content").append("<div class='two2' onclick='editad1(this)' id='" + ad._id + "'>" +
                        "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                        "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                        "<span class='featured' style='float: left' >FEATURED</span>" +
                        "<img class='images2' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                        "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                        "<p class='para'>₹" + ad.price + "</p>" +
                        "<p class='para'>" + ad.title + "</p>" +
                        "<k style='font-size:large'>" + date + "</k>" +
                        "</form>" +
                        "</div>")
                } else {
                    $("#content").append("<div class='two' onclick='editad1(this)' id='" + ad._id + "'>" +
                        "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                        "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                        "<img class='images' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                        "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                        "<p class='para'>₹" + ad.price + "</p>" +
                        "<p class='para'>" + ad.title + "</p>" +
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
        } else {
            $('#content').empty()
            $('#content').append(`<div style="margin: 8% 0px" class='jumbotron'>No Ads Available for the filter</div>`)
                $('#ShowMoreButton').css('display','none')

        }
    })
}
function fireQuery() {
    $.ajax({
        url: 'https://bechdaal.tech/search/main',
        method: 'POST',
        data: {
            isAjax: '1',
            sorting: 1,
            page: page,
            searchInput: searchInput1,
            locality: locality,
            category: category
        }
    }).done(function (result) {
        result.forEach(ad => {
            let date = new Date(ad.date_posted).toDateString()
            if (ad.isPaid === 2) {
                $("#content").append("<div class='two2' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<span class='featured' style='float: left' >FEATURED</span>" +
                    "<img class='images2' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para'>₹" + ad.price + "</p>" +
                    "<p class='para'>" + ad.title + "</p>" +
                    "<k style='font-size:large'>" + date + "</k>" +
                    "</form>" +
                    "</div>")
            } else {
                $("#content").append("<div class='two' onclick='editad1(this)' id='" + ad._id + "'>" +
                    "<form action='/sell/show' method='post' id='form" + ad._id + "'>" +
                    "<input type='hidden' name='adId' value='" + ad._id + "'>" +
                    "<img class='images' src='" + ad.cover_photo + "'><span id='icon" + ad._id + "'><i id='black-" + ad._id +
                    "' class='fa fa-heart icondisplay  sharethis-inline-share-buttons' aria-hidden='true' style='z-index: 10' onclick='event.stopPropagation();check(this)'></i></span>" +
                    "<p class='para'>₹" + ad.price + "</p>" +
                    "<p class='para'>" + ad.title + "</p>" +
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
        if(result.length===0){
            $('#ShowMoreButton').css('display','none')
        }
    })
}

