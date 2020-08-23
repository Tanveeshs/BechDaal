const redis = require('../config/redisConfig').redis
let moment = require('moment')

function incrementPageCount(){
    redis.get("Count",function (err,reply){
        if(err){
            console.log("redis error")
            return
        }
        if(reply===null){
            console.log("Value Not found")
            return
        }
        reply = Number(reply)+1
        let a = redis.set("Count",reply)
    })
    redis.get("DailyCount",function (err,reply){
        if(err){
            console.log("redis error")
            return
        }
        if(reply===null){
            console.log("Value Not found")
            return
        }

        reply = Number(reply)+1
        let a  = redis.set("DailyCount",reply)
    })
}







module.exports.incrementPageCount = incrementPageCount