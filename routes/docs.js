const express = require('express');
const router = express.Router();


router.get('/privacy-policy',(req,res)=>{
    res.render('docs/privacypolicy.ejs')
})
router.get('/terms-of-service',(req,res)=>{
    res.render('docs/termsofservice.ejs')
})
router.get('/refund-policy',(req, res) => {
    res.render('docs/refundpolicy.ejs')
})


module.exports = router