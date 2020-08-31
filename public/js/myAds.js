function editad(input) {
    var ad = input.id
    $.ajax({
        type: 'GET',
        url: '/sell/editad/' + ad,
        success: function () {
            window.location.href = 'http://localhost:3001/sell/editad/' + ad
        },
        error: function () {
            console.log('fail')
        }
    });
}
function editad1(input){
    var form = document.getElementById("form"+input.id);
    console.log("Hit")
    form.submit()
}
let data;
let page =0;
$.ajax({
    type: 'GET',
    url: '/sell/ad/ad',
    success: function (res) {
        data = [...res];
        let s;
        (data.length < 3 ? (s = [...data.slice(0, data.length)]) : (s = [...data.slice(0, 3)]))
        var len = s.length
        for (let i = 0; i < len; i++) {
            let date = new Date(s[i].date_posted).toDateString()
            if(s.length===1){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
            }
            if(s.length===2){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-md-6 col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
            }
            if(s.length===3){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-md-4 col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
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
    page +=1;
    if ((data.length) > (page * 3)) {
        var ctr = page + 1;
        first.textContent = ctr
        let s;
        (data.length % (3 * (page + 1)) >= 0 ?
            (s = data.slice(3 * page, 3 * page + 3)) :
            (s = data.slice(3 * page, data.length)))
        $(".mainContent").empty();
        for (let i = 0; i < s.length; i++) {
            let date = new Date(s[i].date_posted).toDateString()
            if(s.length===1){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
            }
            if(s.length===2){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-md-6 col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
            }
            if(s.length===3){
                $(".mainContent").append(
                    "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-md-4 col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                    "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
            }
        }
    }else{
        page -=1;
        first.textContent = "Last"
    }
})
previous.addEventListener('click', () => {
    first.textContent = ""
    page -=1;
    if (page >= 0) {
        var ctr = page + 1;
        first.textContent = ctr
        let s = data.slice(3*page,3*page+3)
        $(".mainContent").empty();
        for (let i = 0; i < 3; i++) {
            let date = new Date(s[i].date_posted).toDateString()
            $(".mainContent").append(
                "<div id='"+s[i]._id+"' onclick='editad1(this)' class='col-md-4 col-sm-12 paddings' style='width:500px;height:500px;' >\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> " +
                "<center><img class='Img mx-auto' style='' src='"+s[i].cover_photo+"' /> </center>\
                    <br />\
                    <label for='title' class='text'>Title</label>\
                    <label for='' class='label-text'>"+convertTitle(s[i].title)+"\
                    </label>\
                    <br />\
                    <label for='title'>Date posted</label>\
                    <label for='' class='label-text'>"+date+"</label>\
                    <form method='POST' id='form"+s[i]._id+"' action='/sell/editad/view'>\
                    <input type='hidden' name='adid' value='"+s[i]._id+"'>\
                    </form>\
                  </div>\
                </div>\
              </div>\
              ")
        }
    }else{
        page+=1;
        first.textContent = "First"
    }
})
function convertTitle(title){
    let newTitle;
    if(title.length>17){
        newTitle = title.slice(0,17);
        newTitle = newTitle.concat('...')
        return newTitle
    }
    else{
        return title
    }
}