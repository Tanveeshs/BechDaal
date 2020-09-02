const express = require('express')
const router = express.Router()
const xml = require('xml')

router.get('/',(req,res)=>{
    res.set('Content-Type','text/xml')
    res.send('<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset\n' +
        '      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
        '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
        '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n' +
        '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n' +
        '<!-- created with Free Online Sitemap Generator www.xml-sitemaps.com -->\n' +
        '\n' +
        '\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>1.00</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/login</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/contact</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/docs/privacy-policy</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/docs/refund-policy</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/docs/terms-of-service</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/sitemap</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.80</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/forgot/forgotpassword</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.64</priority>\n' +
        '</url>\n' +
        '<url>\n' +
        '  <loc>https://bechdaal.tech/signup</loc>\n' +
        '  <lastmod>2020-09-02T07:03:48+00:00</lastmod>\n' +
        '  <priority>0.64</priority>\n' +
        '</url>\n' +
        '\n' +
        '\n' +
        '</urlset>')
})


module.exports = router