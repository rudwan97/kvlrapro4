const express = require('express');
var bodyParser 	= require('body-parser');

const app = express();

app.get('/api/hello', (request, res, next) =>{
    console.log(request.url);
    res.status(500);
    res.json("Hello");
    console.log("gelukt");
    next();
});

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use('/apiv4', require('./routes/apiv4'));
app.all('*', (request, respons)=>{
    respons.status(500);
});
//

var port = 5000;
app.listen(port, () =>{
    console.log("server is starting");
});

module.exports = app;