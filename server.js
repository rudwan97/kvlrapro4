const express = require('express');
var bodyParser 	= require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use('/apiv4', require('./routes/apiv4'));
app.all('*', (request, respons)=>{
    respons.status(500);
});
//

var port = process.env.PORT || 8080;
app.listen(port, () =>{
    console.log("Server listening to port: " + port);
});

module.exports = app;