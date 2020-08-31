function onSellerClick() {
    $("#MobileNumber").append(`<div id='mobile' class="card" >
                                       <div class="iconContainer">
                                         <p> <i class="fa fa-2x fa-mobile" style="color: black;" aria-hidden="true"></i>
                                         </p>
                                       </div>
                                       <div class="inputContainer" style="width:70%">
                                         <label class="text-muted" style="padding-top: 10px;">Mobile Number</label>
                                         <br />
                                         <input type="tel" id="phone" name="phone" required>
                                       </div>
                                     </div>
`);
}
function onUserClick(){
    $("#MobileNumber").empty();
}