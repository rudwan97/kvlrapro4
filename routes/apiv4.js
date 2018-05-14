
const db = require('../db/connector');
const express = require('express');
const data = require('../modules/intel');
const router = express.Router();
const assert = require('assert');


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

// router.post('/add', (req,res,next) =>{
//     const name = req.params.naam;
//
//     db.query('INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (Test, Test, 2);',
//         (error, rows, fields) => {
//             if (error) {
//                 res.status(500).json(error.toString())
//             } else {
//                 res.status(200).json(rows)
//             }
//         })
// });

router.post('/studentenhuis', (req, res, next) => {

    var naam = req.body.naam || '';
    var adress = req.body.adress || '';
    var userid = 1;




    const query = {
        sql: 'INSERT INTO `studentenhuis`(Naam, Adres, UserID) VALUES (?,?,?)',
        values: [naam, adress,userid],
        timeout: 2000
    };

    console.log('QUERY: ' + query.sql);

    db.query( query, (error, rows, fields) => {
        if (error) {
            res.status(500).json(error.toString())
        } else {
            res.status(200).json(rows)
        }
    })
    res.status(200).json('ok')

});

router.get('/studentenhuis', (req,res,next) =>{
    const name = req.params.naam;

    db.query('SELECT * FROM studentenhuis',
        (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            } else {
                res.status(200).json(rows)
            }
        })
});

module.exports = router;