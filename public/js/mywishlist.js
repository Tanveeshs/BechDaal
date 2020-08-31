function deletewish(input) {
    event.stopPropagation();
    var wish = input.id
    $.ajax({
        type: 'GET',
        url: '/wish/' + wish,
        success: function () {
            window.location.href = 'https://bechdaal.tech/wish/'
        },
        error: function () {
            console.log('fail')
        }
    });

}
let data = [];
let page = 0;
$.ajax({
    type: 'GET',
    url: '/wish/test',
    success: function (res) {
        data = [...res];
        console.log(data)
        let s;
        (data.length < 3 ? (s = [...data.slice(0, data.length)]) : (s = [...data.slice(0, 3)]))
        var len = s.length
        for (let i = 0; i < len; i++) {
            if(s.length==1){
                $(".mainContent").append(
                    "<div class='col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
            if(s.length===2){
                $(".mainContent").append(
                    "<div class='col-md-6 col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
            if(s.length===3){
                $(".mainContent").append(
                    "<div class='col-md-4 col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
        }
    },
    error: function (err) {
        console.log(err);
    }
})
const main = document.querySelector("#main")
const first = document.querySelector("#first");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");


next.addEventListener('click', () => {
    first.textContent = ""
    page += 1;
    if ((data.length) > (page * 3)) {
        var ctr = page + 1;
        first.textContent = ctr
        let s;
        (data.length % (3 * (page + 1) )>= 0 ?
            (s = data.slice(3 * page, 3 * page + 3)) :
            (s = data.slice(3 * page, data.length)))

        $(".mainContent").empty();
        for (let i = 0; i < s.length; i++) {
            if(s.length==1){
                $(".mainContent").append(
                    "<div class='col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
            if(s.length===2){
                $(".mainContent").append(
                    "<div class='col-md-6 col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
            if(s.length===3){
                $(".mainContent").append(
                    "<div class='col-md-4 col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
              <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                <div class='card text-white car mx-auto'>\
                  <div class='card-body'>\
                    <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                    <br>\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>" + s[i].title + "</label>\
                    <br>\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                  </div>\
                  </form>\
                </div>\
                <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                <div class='rem-left'></div>\
              </div>\
              ")
            }
        }
    } else {
        page -= 1;
        first.textContent = "Last"
    }
})
previous.addEventListener('click', () => {
    first.textContent = ""
    page -= 1;
    if (page >= 0) {
        var ctr = page + 1;
        first.textContent = ctr
        let s = data.slice(3 * page, 3 * page + 3)
        $(".mainContent").empty();
        for (let i = 0; i < 3; i++) {
            $(".mainContent").append(
                "<div class='col-md-4 col-sm-12 paddings' onclick='openAd(this)' id='" + s[i]._id + "'>\
          <form action='/sell/show' method='post' id='form"+ s[i]._id + "'>\
              <input type='hidden' value='"+ s[i]._id + "' name='adId'>\
                  <div class='card text-white car mx-auto'>\
                    <div class='card-body'>\
                      <center><img class='Img mx-auto' style='text-align: center;' src='" + s[i].cover_photo + "' alt='" + s[i].cover_photo + "'></center>\
                      <br>\
                      <label for='title' class='text'>Title</label>\
                      <label for='' class='label-text'>" + s[i].title + "</label>\
                      <br>\
                      <label for='title'>Date posted</label>\
                      <label for='' class='label-text'>" + new Date(s[i].date_posted).toDateString() + "</label>\
                    </div>\
                    </form>\
                  </div>\
                  <label id='" + s[i]._id + "' onclick='deletewish(this)' class='remove'>Remove <i style='padding:0 5px;' class='fas fa-times'></i></label>\
                  <div class='rem-left'></div>\
                </div>\
              ")
        }
    } else {
        page += 1;
        first.textContent = "First"
    }
})
function openAd(input) {
    var form = document.getElementById("form" + input.id);
    console.log("Hit")
    form.submit()

}