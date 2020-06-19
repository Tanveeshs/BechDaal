var express = require('express');
var router = express.Router();
const admin = require('../config/firebase')
const user = require('../model/user')
router.get('/chat',function (req,res) {
    admin.auth().createCustomToken(req.user._id.toString())
        .then(r => {
            console.log('http://localhost:3000/user/' + r)
            res.redirect('http://localhost:3000/user/'+r)
        }).catch((err)=>console.log(err))
})


// router.get('/user',function (req,res) {
//     console.log(req)
//     res.send('Hey')
// })

module.exports = router;
