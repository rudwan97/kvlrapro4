const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth =  require('../auth/authentication');
const settings = require('../config')
const moment = require('moment')
const jwt = require('jwt-simple')
const housecontroller = require('../controllers/studentenhuis.controller');

let payloadid;

router.all( new RegExp("[^(/login|register)]"), function (req, res, next) {

    console.log("VALIDATE TOKEN")

    var token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(token, (err, payload) => {
        payloadid= payload.sub
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else {
            next();
        }
    });
});

function getid(req){
    var token = (req.header('X-Access-Token')) || '';

    const payload = jwt.decode(token, settings.secretkey)
    const id = payload.sub;
    return id;
}

// TODO: Zorgen dat er niet ingelogd kan worden met lege waarden
router.route('/login')
    .post( function(req, res) {

        console.log("login request..");


        var mail = req.body.mail || '';
        var password = req.body.password || '';

        let resultfromquery = [];
        let id;
        let email;
        let pass;
        console.log("checking if user exists..")
        const query = 'SELECT `ID`, `Email`,`Password` FROM `user` WHERE `Email` =\''+ mail + '\' AND `Password` = \'' + password + '\'';
        console.log("executing query...")
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

                 console.log("getting user data from database...")
                 id = resultfromquery[0].ID;
                 email = resultfromquery[0].Email;
                 pass = resultfromquery[0].Password;
                 console.log(id + email + pass);

                if (resultfromquery!==0){
                    res.status(200).json({"token" : auth.encodeToken(id), "email" : email});
                }
                console.log("login succesfull, token sent")
            }
        });
    });

// TODO: Zorgen dat er niet geregistreerd kan worden met lege waarden
router.route('/register')
    .post( function(req, res) {

        console.log("attempting to register...");

        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var mail = req.body.mail
        var password = req.body.password

        const insertQuery = 'INSERT INTO `user` ' +
            '(`Voornaam`, `Achternaam`, `Email`, `Password`)' +
            ' VALUES (\'' + firstname + '\', \'' + lastname + '\', \'' + mail + '\', \'' + password + '\');';

        console.log("inserting sqlquery...");
        console.log(insertQuery);
        if (!isEmpty(firstname), !isEmpty(lastname, !isEmpty(mail, !isEmpty(password)))) {

            db.query(insertQuery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                        console.log("Registreren gestopt");
                    }
                    else {
                        res.status(200).json({message: "Register succesfull, /login with mail and password to obtain api key"})
                        console.log("account aangemaakt")
                    }
                });
        }else{
            res.status(500).json({'error': "One or more fields are empty"});
            console.log("Registreren gestopt");
        }

    });

//TODO: Zorgen dat er niet gepost kan worden met lege bodys
//TODO: Correcte fout afhandeling
router.post('/studentenhuis', housecontroller.addHouse);
router.put('/studentenhuis/:id',housecontroller.updateHouse);
router.get('/studentenhuis/:id?',housecontroller.getHousesById);
//router.delete('/studentenhuis/:id',housecontroller.deleteHouse);
//
//TODO: Zorgen dat als er meerdere zijn de code ook werkt
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
            });
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


router.route('/studentenhuis/:id')
    .delete(function (req,res) {

        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var houseId = req.params.id;
        var id = payloadid || '';
        var olduserid;
        try {
            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId
            console.log(useridquery)
            db.query(useridquery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } else {
                        olduserid = rows[0].UserID;
                        console.log("oorspronkelijke userid: " + olduserid);
                    }
                })
        }catch (e) {

        }
        const deletequery = 'DELETE FROM studentenhuis WHERE `UserID`= '+ id +' AND `ID` = '+houseId

        console.log(deletequery) ;
        db.query(deletequery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                }
                else if(olduserid !== id){
                    res.json({message:"niet geautoriseerd."})
                }else {
                    res.json({message: 'Studentenhuis gedelete.'})
                }

            })
   });

function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = router;