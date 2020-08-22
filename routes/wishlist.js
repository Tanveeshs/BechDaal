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
                match:{$and:{approved:true,'rejected.val':false,isActive:true}}
            })
        .exec((err,wishlist) => {
            if(err){
                return returnErr(res, "Error", "Our server ran into an error please try again")
            }
            res.render('mywishlist.ejs', {
                user: req.user,
                array:wishlist
            });
        })
});

wishlistRouter.get('/:adId', isLoggedIn, (req, res, next) => {
    const _id = sanitize(req.params.adId);
    Ads.findOne({_id:_id,approved:true,rejected:false,isActive:true})
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
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                return res.render('mywishlist', {
                                    user: req.user,
                                    array: ad
                                });
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
