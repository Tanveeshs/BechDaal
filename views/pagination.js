// let data;
// console.log(<%=categries %>)
// console.log(data)
// let page = 0;
// $.ajax({
//     type: 'GET',
//     url: '/category',
//     success: function (res) {
//         data = [...res];
//         console.log(data)
//         let s = data.slice(0, 2);
//         for (let i = 0; i < 2; i++) {
//             $(".paginationContent").append(

//                 "<div class='" + two + "'>\
//           '<%if (typeof(ad.cover_photo)==='" + undefined + "'){%>'\
//             <img class="images" src='images/1.jpg'><i class='fa fa-heart icondisplay" aria - hidden="true" ></i >
//             '<%} else {%>'
//             < img class= "images" src = '<%= ad.cover_photo %>' > <i class="fa fa-heart icondisplay" aria-hidden="true"></i>
//             <%}%>
//                 <p class="para">₹ <%=ad.price%></p>
//                 <p class="para"><%=ad.title%></p>
//                 <k><%=ad.date_posted%></k>
//         </div >
//             ")
//     }
// },
//     error: function (err) {
//         console.log(err);
//     }
//     })
// const main = document.querySelector("#main")
// const first = document.querySelector("#first");
// const previous = document.querySelector("#previous");
// const next = document.querySelector("#next");


// next.addEventListener('click', () => {
//     first.textContent = ""
//     page += 1;
//     if ((data.length / 2) + 1 >= (page + 1)) {
//         var ctr = page + 1;
//         first.textContent = ctr
//         let s = data.slice(2 * page, 2 * page + 2)
//         $(".mainContent").empty();
//         for (let i = 0; i < 2; i++) {
//             $(".mainContent").append(
//                 "<div id='" + s[i]._id + "' onclick='editad(this)' class='col-md-4 col-sm-12 paddings'>\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> <img class='Img mx-auto' style='text-align: center;' src='/" + s[i].cover_photo.filename + " %>' />\
//                     <br />\
//                     <label for='title' class='text'>Title</label>\
//                     <label for='' class='label-text'>"+ s[i].title + "\
//                     </label>\
//                     <br />\
//                     <label for='title'>Date posted</label>\
//                     <label for='' class='label-text'>"+ s[i].date_posted + "</label>\
//                   </div>\
//                 </div>\
//               </div>")
//         }
//     } else {
//         page -= 1;
//         first.textContent = "Last"
//     }
// })
// previous.addEventListener('click', () => {
//     first.textContent = ""
//     page -= 1;
//     if ((data.length / 2) + 1 >= (page + 1)) {
//         var ctr = page + 1;
//         first.textContent = ctr
//         let s = data.slice(2 * page, 2 * page + 2)
//         $(".mainContent").empty();
//         for (let i = 0; i < 2; i++) {
//             $(".mainContent").append(
//                 "<div id='" + s[i]._id + "' onclick='editad(this)' class='col-md-4 col-sm-12 paddings'>\<div class='card bg-danger text-white car mx-auto'> <div class='card-body'> <img class='Img mx-auto' style='text-align: center;' src='/" + s[i].cover_photo.filename + " %>' />\
//                     <br />\
//                     <label for='title' class='text'>Title</label>\
//                     <label for='' class='label-text'>"+ s[i].title + "\
//                     </label>\
//                     <br />\
//                     <label for='title'>Date posted</label>\
//                     <label for='' class='label-text'>"+ s[i].date_posted + "</label>\
//                   </div>\
//                 </div>\
//               </div>")
//         }
//     } else {
//         page += 1;
//         first.textContent = "First"
//     }
// })