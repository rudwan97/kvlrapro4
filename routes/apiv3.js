const express = require('express');
const data = require('../modules/intel');
const router = express.Router();
const auth =  require('../auth/authentication');
const users = require('../modules/users');

//Zorgt ervoor dat je altijd moet inloggen
router.all( new RegExp("[^(\/login)]"), function (req, res, next) {

    //
    console.log("VALIDATE TOKEN")

    var token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else {
            next();
        }
    });
});

router.route('/login')

    .post( function(req, res) {

        //
        // Get body params or ''
        //
        var username = req.body.username || '';
        var password = req.body.password || '';

        //
        // Check in datasource for user & password combo.
        //
        //
        result = users.filter(function (user) {
            if( user.username === username && user.password === password) {
                return ( user );
            }
        });

        // Debug
        console.log("result: " +  JSON.stringify(result[0]));

        // Generate JWT
        if( result[0] ) {
            res.status(200).json({"token" : auth.encodeToken(username), "username" : username});
        } else {
            res.status(401).json({"error":"Invalid credentials, bye"})
        }

    });

router.get('/cpu/intel/:year?', (req, res) =>{


    const year = req.params.year || '';
    let qresult = [];
    if (year === ''){
        qresult = data;
    } else {
        qresult = data.filter((item) =>{
            return (item.info.year === year);
        });
    }

    res.json(qresult);
});
module.exports = router;