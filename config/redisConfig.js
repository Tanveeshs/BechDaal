let redis = require('redis')
let redisClient = redis.createClient({
    port:15546,
    host:process.env.redis_host,
    password:process.env.redis_pass
})

redisClient.on('ready',function() {
    console.log("Redis is ready");
});


redisClient.on('error',function(err) {
    console.log("Error in Redis err: %j", err);
});

module.exports.redis = redisClient