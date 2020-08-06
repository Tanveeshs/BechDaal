const express = require('express')
const Router = express.Router();
const jwt = require('jsonwebtoken')
const ad = require('../model/ad')
const users = [
    {
        username:'admin',
        password:'admin',
        role:'admin'
    },
    {
        username: 'admin2',
        password: 'admin2',
        role: 'admin'
    }
]
const secret = 'SSSS'
const authenticateJWT = (req, res, next) => {
    const authHeader = req.session.token;
    if (authHeader) {
        jwt.verify(authHeader, secret, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
Router.get('/login',(req,res)=>{
    res.render('adminLogin.ejs')
})
Router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, secret);
        req.session.token = accessToken
        console.log(req.session)
        res.redirect('home')
    } else {
        res.send('Username or password incorrect');
    }
});
Router.get('/ads',authenticateJWT,(req,res)=>{
    ad.find({approved:false,"rejected.val":false},function (err,results){
        res.render('adminAds.ejs',{ads:results})
    })
})
Router.post('/ads/approve/:id', authenticateJWT,(req,res)=>{
    const adId = req.params.id;
    ad.findOne({_id:adId},function (err,result) {
        result.approved = true;
        result.save()
        res.redirect('/admin/ads')
    })
})

Router.post('/ads/reject/:id',authenticateJWT,(req,res)=> {
    const adId = req.params.id;
    ad.findOne({_id: adId}, function (err, result) {
        result.rejected.val = true;
        result.rejected.reason = req.body.reason
        console.log(req.body)
        result.save()
        res.redirect('/admin/ads')
    })
})

Router.get('/home', authenticateJWT, (req, res) => {
    res.render('adminPage.ejs')
});


module.exports = Router