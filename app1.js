var express = require('express');
const cors = require('cors')
var app = express();
const fetch = require('node-fetch');

app.use(express.json());
app.use(cors())



app.get('/getUser',function (req,res) {
    fetch('http://localhost:3001/apiFetch')
        .then(res => console.log(res.json()))
        .then(json => console.log(json));
    res.send('Hey')

})



app.listen(3002,function (err) {
    console.log('Server started');
});
