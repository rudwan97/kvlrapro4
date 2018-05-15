const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth = require('../auth/authentication');
const jwt = require('jwt-simple');
const settings = require('../config');

function getid(req) {
    var token = (req.header('X-Access-Token')) || '';
    const payload = jwt.decode(token, settings.secretkey);
    const id = payload.sub;
    return id;
}

module.exports = {
    getHousesById(req, res, next) {
        console.log("ID: " + getid(req) + " is making a getHouse request!");
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
    },
    addHouse(req, res) {
        console.log("ID: " + getid(req) + " is making a get request!");
        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var id = getid(req) || '';

        const postquery = 'INSERT INTO `studentenhuis` (`Naam`,`Adres`,`UserID`)\n' +
            'VALUES(\'' + name + '\',\'' + adress + '\',' + id + ')'
        console.log(postquery);

        db.query(postquery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.json({
                        message: 'Studentenhuis toegevoegd.'
                    })
                }
            })
    },
    updateHouse(req, res) {
        console.log("ID: " + getid(req) + " is making a update request!");
        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var houseId = req.params.id;
        var id = getid(req) || '';
        var olduserid;

        try {
            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId;
            console.log(useridquery)
            db.query(useridquery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } if (rows.size === 0) {
                        console.log("huis niet gevonden")

                    } else {
                        console.log(olduserid = rows[0].UserID);
                        olduserid = rows[0].UserID;
                        console.log("oorspronkelijke userid: " + olduserid);

                        const updatequery = 'UPDATE studentenhuis SET `Naam` = \'' + name + '\', `Adres` = \'' + adress + '\' WHERE `UserID`= ' + id + ' AND `ID` = ' + houseId + '';

                        console.log(updatequery);
                        db.query(updatequery,
                            (error, rows, fields) => {
                                if (error) {
                                    res.status(500).json(error.toString())
                                } else if (olduserid !== id) {
                                    res.json({
                                        message: "niet geautoriseerd."
                                    })
                                } else {
                                    res.json({
                                        message: 'Studentenhuis geupdate.'
                                    })
                                }

                            })
                    }
                })
        } catch (e) {
            console.log(e);
        }
    },
    deleteHouse(req, res) {
        console.log("ID: " + getid(req) + " is making a Delete request!");
        var houseId = req.params.id;
        var idFromToken = getid(req) || '';
        var idFromCreator;
        var houseFound = true;
        try {
            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId
            console.log(useridquery)
            db.query(useridquery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } else if (rows.length === 0 || rows.size === 0) {
                        res.json({
                            message: "Er is geen studentenhuis met het meegegeven id gevonden!"
                        })
                        houseFound = false;
                    } else {
                        idFromCreator = rows[0].UserID;
                        console.log("oorspronkelijke userid: " + idFromCreator);

                        const deletequery = 'DELETE FROM studentenhuis WHERE `UserID`= ' + idFromToken + ' AND `ID` = ' + houseId

                        console.log(deletequery);
                        db.query(deletequery,
                            (error, rows, fields) => {
                                if (error) {
                                    res.status(500).json(error.toString())
                                } else if (idFromCreator !== idFromToken) {
                                    res.json({
                                        message: "niet geautoriseerd."
                                    })
                                } else {
                                    res.json({
                                        message: 'Studentenhuis gedelete.'
                                    })
                                }

                            })
                    }
                })
        } catch (e) {
            console.log(e);
        }
    }
};