//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Ads = require('../model/ad');
const {
  user
} = require('../model/user');
var {
  User
} = require('../model/user');

router.get('/:userId',function(req, res){
    const _id = req.params.userId;
    User.findById(_id)
        .then((user) => {
            if (user != null) {
                res.send(user.offers);
        //       User.findById(req.user._id)
        //         .then((user) => {
        //           if (user.wishlist.includes(_id)) {
        //             user.wishlist.splice(user.wishlist.indexOf(_id), 1);
        //           } else {
        //             user.wishlist.push(_id);
        //           }
        //           user.save()
        //             .then((user) => {
        //               res.statusCode = 200;
        //               res.setHeader('Content-Type', 'application/json');
        //               res.render('mywishlist', {
        //                 user: req.user,
        //                 array: ad
        //               });
        //               // res.redirect('/wish')
        //             });
        //         });
        //     } else {
        //       console.log('the ad id is wrong!');
        //       res.statusCode = 404;
        //       res.setHeader('Content-Type', 'application/json');
        //       res.json({
        //         msg: 'wrong ad id'
        //       });
        //     }
        //   })
        //   .catch((err) => console.log(err));
        }
    });
});



module.exports = router;