const express = require('express');
const app = express();

app.use('/apiv1', require('./routes/apiv1'));

app.get('/api/hello', (request, res, next) =>{
    console.log(request.url);
    res.status(500);
    res.json("Hello");
    console.log("gelukt");
    next();
});

app.all('*', (req,respons)=>{
    respons.status(500);
});

app.listen(process.env.PORT, ()=>{
    console.log('server started');
});