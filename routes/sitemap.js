const express = require('express')
const router = express.Router()
const xml = require('xml')

router.get('/',(req,res)=>{
    res.set('Content-Type','text/xml')
    res.send('<?xml version="1.0" encoding="UTF-8"?>\n' +
        '\t\t<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        '<url>\n' +
        '\t<loc>https://bechdaal.tech/</loc>\n' +
        '\t<lastmod>2020-08-16T13:26:32+01:00</lastmod>\n' +
        '\t<priority>1.0</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '\t<loc>https://bechdaal.tech/login</loc>\n' +
        '\t<lastmod>2020-08-16T13:26:34+01:00</lastmod>\n' +
        '\t<priority>1.0</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '\t<loc>https://bechdaal.tech/signup</loc>\n' +
        '\t<lastmod>2020-08-16T13:26:39+01:00</lastmod>\n' +
        '\t<priority>1.0</priority>\n' +
        '</url>\n' +
        '</urlset>')
})


module.exports = router