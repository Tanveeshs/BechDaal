const express = require('express')
const Router = express.Router()
const helpAndSupport = require('../model/helpandsupport')

Router.get('/',(req,res)=>{
    res.render('contactus.ejs',{
        user:req.user
    })
})
Router.post('/',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const category = req.body.category;
    const message = req.body.message;
    let obj = {}
    if(req.user){
        obj.category = category;
        obj.message = message;
        obj.status = "Open";
        obj.reg_user = req.user;
    }
    else {
        obj.category = category;
        obj.message = message;
        obj.status = "Open";
        obj.non_reg_user = {};
        obj.non_reg_user.name = name;
        obj.non_reg_user.email = email;
    }

    let helpObj = new helpAndSupport(obj)
    console.log(helpObj)
    helpObj.save((err)=>{
        if(err){
            console.log(err)
            return returnErr(res, "Error", "Our server ran into an error please try again")
        }
        res.send("Complaint Created")
    })

})

function returnErr(res,message,err){
    res.render('error.ejs',{
        message:message,
        error:err
    })
}

module.exports = Router

