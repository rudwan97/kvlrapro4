const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth = require('../auth/authentication');
const jwt = require('jwt-simple');
const settings = require('../config');

function callMeWhenDone(){
    console.log("Async task completed")
}

function getid(req) {
    var token = (req.header('X-Access-Token')) || '';
    const payload = jwt.decode(token, settings.secretkey);
    const id = payload.sub;
    return id;
}
module.exports = {
    addMeal(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a post request!");
        var requestId = getid(req);
        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || '');
        var houseId = req.params.id;


        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;

        db.query(getHouse, (error, creatorResult) => {
            console.log("Er is " + creatorResult.length + " huis gevonden met het meegegeven id")
            if (creatorResult.length !== 0) {
                if (creatorResult[0].ID == houseId) {
                    console.log("Het huis met de meegegeven id is gevonden! ID =" + creatorResult[0].ID);
                    db.query('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)',
                        [name, description, ingredients, allergy, price, requestId, houseId],
                        (errorMeals, resultMeals) => {

                            if (error) {
                                console.log(error)
                                res.status(500).json({"error": "An error occured while fetching the data"})
                            }
                            else {
                                res.status(200).json({"message": "De maaltijd is succesvol toegevoegd!"});
                                console.log("Actie succesvol")
                            }
                        })
                } else {
                    res.json("Bestaat niet")
                }
            } else {
                res.status(500).json({error: "Er bestaat geen huis met het meegegeven id"})
                console.log("Huis niet gevonden")
            }
        })
    },
    deleteMeal(req, res) {
        console.log("////////////NEW REQUEST////////////")
        console.log("ID: " + getid(req) + " is making a delete request!");
        var requestId = getid(req);
        var houseId = req.params.id;
        var mealId = req.params.mealid;


        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        const getCreatorOfMeal = 'SELECT * FROM maaltijd WHERE `UserID` =' + requestId;
        const deleteQuery = 'DELETE FROM maaltijd WHERE `ID` = ' + mealId;

        console.log(getCreatorOfMeal);
        db.query(getHouse, (error, houseResult) => {
            console.log("Er is " + houseResult.length + " huis gevonden met het meegegeven huisid");
            db.query(getCreatorOfMeal, (error, creatorResult) => {
                console.log("aanmaker id:" + creatorResult[0].UserID);
                console.log(houseResult.length !== 0)
                if (houseResult.length !== 0 && creatorResult !== 0) {
                    console.log(houseResult[0].ID == houseId);
                    if (houseResult[0].ID == houseId) {
                        console.log(creatorResult[0].UserID === requestId)
                        console.log(creatorResult[0].ID === mealId);
                        console.log(mealId);
                        console.log(creatorResult[0].ID)
                        if (creatorResult[0].UserID === requestId) {
                            db.query(deleteQuery, (error, result) => {
                                if (error) {
                                    console.log(error)
                                    res.status(500).json({"error": "An error occured while fetching the data"})
                                }
                                else {
                                    res.status(200).json({"message": "De maaltijd is succesvol gedelete!"});
                                    console.log("Actie succesvol")
                                }
                            })
                        } else {
                            //TODO: APARTE ERROR MESSAGES.
                            res.json("Deze bestaat niet of heb jij niet gemaakt!");
                        }
                    } else {
                        console.log("iets niet gevonden")
                    }
                } else {
                    res.status(500).json({error: "Er bestaat geen huis met het meegegeven id"})
                    console.log("Huis niet gevonden")
                }
            })
        })

    },
    getMeal(req, res, next) {
        const meal = req.params.maaltijd || '';
        const id = req.params.id || '';
        if (meal == '') {
            db.query('SELECT * ' +
                'FROM `maaltijd` ' +
                'WHERE `StudentenhuisID` = ' + id, (error, rows, fields) => {
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
                ' AND `ID` = ' + meal);
            db.query('SELECT * FROM `maaltijd` ' +
                'WHERE `StudentenhuisID` = ' + id +
                ' AND `ID` = ' + meal, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
        }
    },
    putMeal(req, res, next) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a put request!");
        var requestId = getid(req);

        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || '');
        var houseId = req.params.id;
        var mealid = req.params.mealid;


        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        const getMeals = 'SELECT * FROM maaltijd WHERE `ID` = ' + mealid;
        db.query(getHouse, (error, houseResult) => {
            console.log("Er is " + houseResult.length + " huis gevonden met het meegegeven id");
            db.query(getMeals, (error,mealsResult) => {

                if (houseResult.length !== 0) {
                    if (mealsResult.length !== 0) {
                       if (requestId === mealsResult[0].UserID) {
                           console.log("Het huis met de meegegeven id is gevonden! ID =" + houseResult[0].ID);
                           db.query('UPDATE maaltijd SET `Naam` = ?, `Beschrijving` = ?, `Ingredienten` = ?, `Allergie` = ?, `Prijs` = ?, `UserID` = ?, `StudentenhuisID` = ?',
                               [name, description, ingredients, allergy, price, requestId, houseId],
                               (errorMeals, resultMeals) => {

                                   if (errorMeals) {
                                       console.log(errorMeals)
                                       res.status(500).json({"error": "An error occured while fetching the data"})
                                   }
                                   else {
                                       res.status(200).json({"message": "De maaltijd is succesvol upgedate!"});
                                       console.log("Actie succesvol")
                                   }
                               })
                       } else {
                           res.json("Geen rechten")
                       }
                    }else{
                        res.json("Geen maaltijd gevonden")
                    }
                } else {
                    res.status(500).json({error: "Er bestaat geen huis met het meegegeven id"})
                    console.log("Huis niet gevonden")
                }
            })
        })
    }
}