const express = require('express')
const Router = express.Router()
const PaytmChecksum = require('paytmchecksum')
const crypto = require('crypto')
const https = require("https");


Router.post('/success',function (req,res){
        res.render('success.ejs')
})
Router.get('/',function (req,res){
    var paytmParams = {}
    const order_id = Date.now()
    paytmParams.body = {
        "requestType"   : "Payment",
        "mid"           : "iQclut82587421891754",
        "websiteName"   : "BechDaal",
        "orderId"       : order_id,
        "callbackUrl"   : "http://localhost:3001/payment/success",
        "txnAmount"     : {
            "value"     : "20.00",
            "currency"  : "INR",
        },
        "userInfo"      : {
            "custId"    : "Veesh"
        },
    };
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "rCNCzYeolKhWODWv").then(function(checksum){
        paytmParams.head = {
            "signature"	: checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {
            /* for Staging */
            hostname: 'securegw-stage.paytm.in',
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=iQclut82587421891754&orderId='+order_id,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        var response = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function(){
                console.log('Response: ', response);
                const obj= JSON.parse(response)
                console.log()
                res.render('payment.ejs',{
                    'order_id':order_id,
                    'txnToken':obj.body.txnToken
                })
            });
        });

        post_req.write(post_data);
        post_req.end();
    });

})

module.exports = Router;