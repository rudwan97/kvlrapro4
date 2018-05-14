const express = require('express');

const app = express();

app.get('/api/hello', (request, res, next) =>{
    console.log(request.url);
    res.status(500);
    res.json("Hello");
    console.log("gelukt");
    next();
});

app.use('/apiv4', require('./routes/apiv4'));
app.all('*', (request, respons)=>{
    respons.status(500);
});
//
app.listen(process.env.PORT, () =>{
    console.log("the magic happens at !" +
        "8080");
});