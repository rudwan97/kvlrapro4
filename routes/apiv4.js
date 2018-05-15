const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth = require('../auth/authentication');
const settings = require('../config')
const moment = require('moment')
const jwt = require('jwt-simple')
const housecontroller = require('../controllers/studentenhuis.controller');
const mealcontroller = require('../controllers/meal.controller');

router.all(new RegExp("[^(/login|register)]"), function(req, res, next) {
    console.log("////////////VALIDATING TOKEN////////////");
    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401)).json({
                error: new Error("Not authorised").message
            });
        } else {
            next();
        }
    });
});

function getid(req) {
    var token = (req.header('X-Access-Token')) || '';
    const payload = jwt.decode(token, settings.secretkey)
    const id = payload.sub;
    return id;
}
router.route('/login')
    .post(function(req, res) {
        console.log("login request..");
        var mail = req.body.mail || '';
        var password = req.body.password || '';
        let resultfromquery = [];
        let id;
        let email;
        let pass;
        console.log("checking if user exists..")
        const query = 'SELECT `ID`, `Email`,`Password` FROM `user` WHERE `Email` =\'' + mail + '\' AND `Password` = \'' + password + '\'';
        console.log("executing query...")
        console.log(query);
        db.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            } else if (rows.length === 0) {
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
                if (resultfromquery !== 0) {
                    res.status(200).json({
                        "token": auth.encodeToken(id),
                        "email": email
                    });
                }
                console.log("login succesfull, token sent")
            }
        });
    });
router.route('/register')
    .post(function(req, res) {
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
            db.query(insertQuery, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                    console.log("Registreren gestopt");
                } else {
                    res.status(200).json({
                        message: "Register succesfull, /login with mail and password to obtain api key"
                    })
                    console.log("account aangemaakt")
                }
            });
        } else {
            res.status(500).json({
                'error': "One or more fields are empty"
            });
            console.log("Registreren gestopt");
        }
    });

//TODO: Zorgen dat er niet gepost kan worden met lege bodys
//TODO: Correcte fout afhandeling
router.post('/studentenhuis', housecontroller.addHouse);
router.put('/studentenhuis/:id', housecontroller.updateHouse);
router.get('/studentenhuis/:id?', housecontroller.getHousesById);
router.delete('/studentenhuis/:id', housecontroller.deleteHouse);

router.post('/studentenhuis/:id/maaltijd', mealcontroller.addMeal)
router.delete('/studentenhuis/:id/maaltijd/:mealid', mealcontroller.deleteMeal);
//TODO: Zorgen dat als er meerdere zijn de code ook werkt
router.get('/studentenhuis/:id/maaltijd/:maaltijd?',mealcontroller.getMeal);
router.put('/studentenhuis/:id/maaltijd/:mealid', mealcontroller.putMeal)



router.get('/studentenhuis/:id/maaltijd/:maaltijd/deelnemers', (req, res, next) => {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    let users = [];
    let userid = [];
    db.query('SELECT UserID ' +
        'FROM `deelnemers` ' +
        'WHERE `StudentenhuisID` = ' + id +
        ' AND `MaaltijdID` = ' + meal, (error, rows, fields) => {
        if (error) {
            res.status(500).json(error.toString())
        } else {
            console.log(rows)
            users = rows;
            for (let i = 0; i < users.length; i++) {
                console.log(users[i].UserID);
                userid[i] = users[i].UserID;
                console.log(userid)
            }
        }
    });
    db.query('SELECT `Voornaam`, `Achternaam`, `Email` FROM `user` WHERE `ID` = ' + userid[0], (error, rows, fields) => {
        if (error) {
            res.status(500).json(error.toString())
        } else {
            res.status(200).json(rows)
            console.log(rows)
        }
    })
});
function isEmpty(str) {
    return (!str || 0 === str.length);
}
module.exports = router;