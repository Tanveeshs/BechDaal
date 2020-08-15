const express = require('express')
const Router = express.Router()
const ad = require('../model/ad')
const user = require('../model/user').User
const sanitize = require("mongo-sanitize");
const async = require('async')
const mongoose = require('mongoose')

//PARAMS:adId,comment
//name ka location final karne ke baad by parameter final hoga
Router.post('/add',(req,res)=>{
    const adId = req.body.adId;
    const comment = req.body.comment;
    ad.findOneAndUpdate({_id:sanitize(adId)},
        {
            $push: {
                reviews: {
                    Comment:comment,
                    by:'Anonymous'
                }}},function (err,docs){
            if(err){
                res.send('err')
            }
            else {
                res.send('Success')
            }
        })
})

//Params
//isLoggedIn
//rating->value
//adId->ObjectId
Router.post('/addRating',isLoggedIn,(req, res) => {
    const rating = Number(req.body.rating);
    const adId = req.body.adId
    // const userID = req.body.userId;
    user.findOne({_id:req.user._id},function (err,resu){
        const a = resu.Ratings.filter(Rating=>String(Rating.adId) === adId)
        if(a.length===0){
            async.parallel([
                function (callback){
                    resu.Ratings.push({rating:rating,adId:mongoose.Types.ObjectId(adId)})
                    resu.save(function (err){
                        if(err){
                            callback(err)
                        }
                        callback(null)
                    })
                },
                function (callback){
                    ad.findOne({_id:adId},function (err,currentAd){
                        if(err){
                            callback(err)
                        }
                        let newRating = (currentAd.AvgRating*currentAd.NumRated + rating)/(currentAd.NumRated+1)
                        currentAd.AvgRating = newRating;
                        currentAd.NumRated = currentAd.NumRated+1;
                        currentAd.save()
                    })
                }
            ],function (err){
                if(err){
                    console.log("Values Not Updated")
                }
                res.send("Updated")
            })
        }
        if(a.length===1){
            let oldRating;
            async.parallel([
                function (callback){
                    resu.Ratings = resu.Ratings.filter(Rating=>String(Rating.adId) !== adId)
                    resu.Ratings.push({rating:rating,adId:mongoose.Types.ObjectId(adId)})
                    resu.save(function (err){
                        if(err){
                            callback(err)
                        }
                        callback(null)
                    })
                },
                function (callback){
                    ad.findOne({_id:adId},function (err,currentAd){
                        if(err){
                            callback(err)
                        }
                        let newRating = (Number(currentAd.AvgRating)*Number(currentAd.NumRated) -Number(a[0].rating)+ Number(rating))/Number(currentAd.NumRated)
                        console.log(newRating)
                        currentAd.AvgRating = newRating;
                        currentAd.save(function (err){
                            if(err){
                                callback(err)
                            }
                            callback(null)
                        })
                    })
                }
            ],function (err){
                if(err){
                    console.log("Values Not Updated")
                }
                req.user = resu
                res.send("Updated")
            })
        }
    })
})

Router.get('/getAllReviews',function (req,res){

    ad.findOne({_id:sanitize(req.body.adId)},{reviews:1,_id:0},function (err,ad){
        if(err){
            res.send("Err")
        }
        const result = {
            reviews: ad.reviews.slice(10)
        }
        res.send(result)
    })
})

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


module.exports = Router