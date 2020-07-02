const express = require('express');
const bodyParser = require('body-parser');
const searchRouter = express.Router();
const Ads = require('../model/ad');

searchRouter.use(bodyParser.json());

searchRouter.route('/autocomplete/:qrystr')
.get((req, res) => {
  let results = [];
  const a = req.params.qrystr;
  const regexp1 = new RegExp(`^${a}`, 'i')  // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${a}`, 'i')  // for finding as beginning of a middle word
  Ads.find({
    category: new RegExp(`${a}`)
  })
  .then((result) => {
    results = results.concat(result)
  })
  Ads.find({
    brand: new RegExp(`${a}`)
  })
  .then((result) => {
    for (let i of result) {
      let bool = false;
      for (let j of results) {
        if (i.title == j.title) {
          bool = true;
          break;
        }
      }
      if (!bool) {
        results.push(i);
      }
    }
  })
  .then(() => {
    res.statusCode = 200;
    const strings = results.map((item, index) => {
      return item.title;
    })
    console.log(strings);
    res.setHeader('Content-Type', 'application/json');
    res.json(strings);
  }).catch((err) => console.log(err))
})


searchRouter.route('/results/:qrystr')
.get((req, res) => {
  let results = [];
  const a = req.params.qrystr;
  const regexp1 = new RegExp(`^${a}`, 'i')  // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${a}`, 'i')  // for finding as beginning of a middle word
  Ads.find({
    category: new RegExp(`${a}`)
  })
  .then((result) => {
    results = results.concat(result)
  })
  Ads.find({
    brand: new RegExp(`${a}`)
  })
  .then((result) => {
    for (let i of result) {
      let bool = false;
      for (let j of results) {
        if (i.title == j.title) {
          bool = true;
          break;
        }
      }
      if (!bool) {
        results.push(i);
      }
    }
  })
  // Ads.find({
  //   title: {
  //     $in: [regexp1, regexp2]
  //   }
  // })
  // .then((result) => {
  //   // console.log(results);
  //   for (let i of result) {
  //     if (!results.includes(i)) {
  //       console.log('not present')
  //       results.push(i);
  //     }
  //   }
  // })
  .then(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(results);
  }).catch((err) => console.log(err))
})




module.exports = searchRouter;
