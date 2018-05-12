const express = require('express');
const app = express();

app.use('/apiv1', require('./routes/apiv1'));
app.all('*', (req,respons)=>{
    respons.status(500);
    respons.json('invalid request');
});

app.listen(process.env.PORT, ()=>{
    console.log('server started');
});