//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const Ads = require('../model/ad');
const sanitize = require('mongo-sanitize');
const {
    User
} = require('../model/user');

const wishlistRouter = express.Router();

wishlistRouter.use(bodyParser.json());

wishlistRouter.get('/', isLoggedIn, (req, res, next) => {
    User.findById(sanitize(req.user._id))
        .populate(
            {path:'wishlist',
                match:{approved:true,'rejected.val':false,isActive:true}
            })
        .exec((err,wishlist) => {
            if(err){
                console.log(err)
                return returnErr(res, "Error", "Our server ran into an error please try again")
            }
            console.log(err)
            console.log(wishlist.wishlist)
            res.render('mywishlist.ejs', {
                user: req.user,
                array:wishlist.wishlist
            });
        })
});

wishlistRouter.get('/test', isLoggedIn, (req, res, next) => {
    User.findById(sanitize(req.user._id))
        .populate(
            {path:'wishlist',
                match:{approved:true,'rejected.val':false,isActive:true}
            })
        .exec((err,wishlist) => {
            if(err){
                console.log(err)
                return returnErr(res, "Error", "Our server ran into an error please try again")
            }
            console.log(err)
            console.log(wishlist.wishlist)
            res.send(wishlist.wishlist);
        })
});

wishlistRouter.get('/:adId', isLoggedIn, (req, res, next) => {
    const _id = sanitize(req.params.adId);
    console.log(_id)
    Ads.findOne({_id:_id,approved:true,"rejected.val":false,isActive:true})
        .then((ad) => {
            if (ad != null) {
                User.findById(sanitize(req.user._id))
                    .then((user) => {
                        if (user.wishlist.includes(_id)) {
                            user.wishlist.splice(user.wishlist.indexOf(_id), 1);
                        } else {
                            user.wishlist.push(_id);
                        }
                        user.save()
                            .then((user) => {
                                req.user = user
                                return res.render('mywishlist', {
                                    user: req.user,
                                    array: ad
                                });
                                res.status(200)
                                res.send("Done")
                                // res.redirect('/wish')
                            });
                    });
            } else {
                return returnErr(res,"Wrong Ad","The you have chosen ain't available")
            }
        })
        .catch((err) => returnErr(res, "Error", "Our server ran into an error please try again"));
});

function isLoggedIn(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            req.isLogged = true;
            return next();
        }
        res.redirect('/login');
    } catch (e) {
        console.log(e);
    }
}

function returnErr(res,message,err){
    res.render('error.ejs',{
        message:message,
        error:err
    })
}

module.exports = wishlistRouter;
