const express = require('express');
const router = express.Router();


router.get('/privacy-policy',(req,res)=>{
    res.render('docs/privacypolicy.ejs',{
        user:req.user
    })
})
router.get('/terms-of-service',(req,res)=>{
    res.render('docs/termsofservice.ejs',
        {
            user:req.user
        })
})
router.get('/refund-policy',(req, res) => {
    res.render('docs/refundpolicy.ejs',{
        user:req.user
    })
})


module.exports = router