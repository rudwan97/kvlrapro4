const express = require('express');
const db = require('../db/connector');
const jwt = require('jwt-simple');
const settings = require('../config');

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

        if (name !== '' && description !== '' && ingredients !== '' && allergy !== '' && price !== '') {
            db.query(getHouse, (error, houseResult) => {
                //   console.log("Er is " + creatorResult.length + " huis gevonden met het meegegeven id")
                if (houseResult.length !== 0) {
                    if (houseResult[0].ID == houseId) {
                        console.log("Het huis met de meegegeven id is gevonden! ID =" + houseResult[0].ID);
                        db.query('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)',
                            [name, description, ingredients, allergy, price, requestId, houseId],
                            (errorMeals, resultMeals) => {
                                if (error) {
                                    console.log(error)
                                    res.status(500).json({"error": "Internal error"})
                                }
                                else {
                                    res.status(200).json({"message": "De maaltijd is succesvol toegevoegd!"});
                                    console.log("Actie succesvol")
                                }
                            })
                    } else {
                        res.status(404).json("Niet gevonden huisId bestaat niet)")
                    }
                } else {
                    res.status(404).json({message: "Niet gevonden (huisId bestaat niet)"})
                    console.log("Huis niet gevonden")
                }
            })
        }else{
            res.status(412).json({"message": "Een of meer properties in de request body ontbreken of zijn foutief"})
        }
    },
    deleteMeal(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a delete request!");
        var requestId = getid(req);
        var houseId = req.params.id;
        var mealId = req.params.mealid;
        console.log("id uit endpoint van maaltijd is" + mealId);


        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        const getMeals = 'SELECT * FROM maaltijd WHERE `UserID` =' + requestId + ' AND `ID`=' + mealId;
        const deleteQuery = 'DELETE FROM maaltijd WHERE `ID` = ' + mealId + ' AND `StudentenhuisID` = '  + houseId;

        console.log(getHouse);
        console.log(getMeals);
        console.log(deleteQuery);
        db.query(getHouse, (error, houseResult) => {
            db.query(getMeals, (error, mealsResult) => {
                if (houseResult.length !== 0 && mealsResult.length !== 0) {
                    if (houseResult[0].ID == houseId) {
                        if (mealsResult[0].UserID === requestId) {
                            if (mealsResult[0].ID == mealId) {

                                db.query(deleteQuery, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        res.status(500).json({"error": "Internal error"})
                                    }
                                    else {
                                        res.status(200).json({"message": "De maaltijd is succesvol gedelete!"});
                                        console.log("Actie succesvol")
                                    }
                                })
                            }else {
                                res.status(404).json({"error": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                            }
                        } else {
                            res.status(409).json({"error": "Conflict (Gebruiker mag deze data niet verwijderen)"});
                        }
                    } else {
                        console.log({"error": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                    }
                }else {
                    res.status(404).json({"error": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                }

            })
        })
    },
    getMeal(req, res, next) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a get request!");
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
                }else if(rows.length === 0){
                    res.status(404).json({"message" : "Niet gevonden (huisId of maaltijdId bestaat niet)"})
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


        if (name !== '' && description !== '' && ingredients !== '' && allergy !== '' && price !== '') {


            const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
            const getMeals = 'SELECT * FROM maaltijd WHERE `ID` = ' + mealid;
            db.query(getHouse, (error, houseResult) => {
                console.log("Er is " + houseResult.length + " huis gevonden met het meegegeven id");
                db.query(getMeals, (error, mealsResult) => {

                    if (houseResult.length !== 0) {
                        if (mealsResult.length !== 0) {
                            if (requestId === mealsResult[0].UserID) {
                                console.log("Het huis met de meegegeven id is gevonden! ID =" + houseResult[0].ID);
                                db.query('UPDATE maaltijd SET `Naam` = ?, `Beschrijving` = ?, `Ingredienten` = ?, `Allergie` = ?, `Prijs` = ?, `UserID` = ?, `StudentenhuisID` = ?',
                                    [name, description, ingredients, allergy, price, requestId, houseId],
                                    (error, resultMeals) => {

                                        if (error) {
                                            console.log(error)
                                            res.status(500).json({"error": "Internal error"})
                                        }
                                        else {
                                            res.status(200).json({"message": "De maaltijd is succesvol upgedate!"});
                                            console.log("Actie succesvol")
                                        }
                                    })
                            } else {
                                res.status(409).json({"message": "Conflict (Gebruiker mag deze data niet wijzigen)"})
                            }
                        } else {
                            res.status(404).json({"message": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                        }
                    } else {
                        res.status(404).json({message: "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                    }
                })
            })
        }else {
            res.status(412).json({message: "Een of meer properties in de request body ontbreken of zijn foutief"})
        }
        }

}