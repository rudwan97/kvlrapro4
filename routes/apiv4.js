const express = require('express');
const data = require('../modules/intel');
const router = express.Router();
const db = require('../db/connector');

router.get('/studentenhuis/:id?', (req,res,next) => {

    const id = req.params.id || '';
    if (id == '') {
        db.query('SELECT * FROM studentenhuis',
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    } else {
        db.query('SELECT * FROM `studentenhuis` WHERE `ID` = 1',
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    }
});

module.exports = router;