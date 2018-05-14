const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth =  require('../auth/authentication');

router.all( new RegExp("[^(/login|register)]"), function (req, res, next) {

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



//
// Login with {"username":"<username>", "password":"<password>"}
//
router.route('/login')

    .post( function(req, res) {

        //
        // Get body params or ''
        //
        var mail = req.body.mail || '';
        var password = req.body.password || '';

        //
        // Check in datasource for user & password combo.
        //
        //
        // result = users.filter(function (user) {
        //     if( user.username === username && user.password === password) {
        //         return ( user );
        //     }
        // });
        let resultfromquery = [];
        let id;
        let email = ''
        let pass;
        const query = 'SELECT `ID`, `Email`,`Password` FROM `user` WHERE `Email` =\''+ mail + '\' AND `Password` = \'' + password + '\'';
        console.log(query);
       db.query(query,
            (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            }
                else if(rows.length ===0){
                    res.status(500).json('User not found, Please register first')
                } else {
                //res.status(200).json(rows)
                 console.log(rows);
                 resultfromquery = rows;
                 console.log(resultfromquery)
                 id = resultfromquery[0].ID;
                 email = resultfromquery[0].Email;
                 pass = resultfromquery[0].Password;

                if (resultfromquery!==0){
                    res.status(200).json({"token" : auth.encodeToken(password), "email" : email});
                }
            }
        });
    });




router.get('/studentenhuis/:id?', (req,res,next) => {

    const id = req.params.id || '';
    if (id == '') {
        db.query('SELECT * ' +
            'FROM studentenhuis',
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    } else {
        db.query('SELECT * ' +
            'FROM `studentenhuis`' +
            ' WHERE `ID` = ' + id,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    }
});

router.get('/studentenhuis/:id/maaltijd/:maaltijd?', (req,res,next) => {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    if (meal == '') {
        db.query('SELECT * ' +
            'FROM `maaltijd` ' +
            'WHERE `StudentenhuisID` = ' + id,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    } else {
        console.log('SELECT * ' +
            'FROM `maaltijd` ' +
            'WHERE `StudentenhuisID` = ' + id +
             ' AND `ID` = '+ meal);
        db.query('SELECT * FROM `maaltijd` ' +
            'WHERE `StudentenhuisID` = ' + id +
            ' AND `ID` = '+ meal,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    }
});

router.get('/studentenhuis/:id/maaltijd/:maaltijd/deelnemers', (req,res,next) => {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    let users=[];
    let userid=[];

        db.query('SELECT UserID ' +
            'FROM `deelnemers` ' +
            'WHERE `StudentenhuisID` = ' + id +
            ' AND `MaaltijdID` = '+ meal,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    console.log(rows)
                    users = rows;
                    for (let i = 0; i < users.length; i++){
                        console.log(users[i].UserID);
                        userid[i] = users[i].UserID;
                        console.log(userid)
                    }
                }
            })
        db.query('SELECT `Voornaam`, `Achternaam`, `Email` FROM `user` WHERE `ID` = ' + userid[0],
        (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            } else {
                res.status(200).json(rows)
                console.log(rows)
            }
        })
});



module.exports = router;