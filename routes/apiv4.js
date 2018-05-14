const express = require('express');
const data = require('../modules/intel');
const router = express.Router();
const db = require('../db/connector');




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
            'FROM `studentenhuis` WHERE `ID` = ' + id,
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