const cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname,'../cloudStorage.json')
const {Storage} = cloud
const storage = new Storage({
    keyFilename:serviceKey,
    projectId:'stoked-courier-276420'
})

module.exports = storage;