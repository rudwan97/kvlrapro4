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
    getDeelnemers(req, res, next) {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    let users = [];
    let userData = [];
    // let userIds = [];


    const userIdQuery = 'SELECT UserID ' +
        'FROM `deelnemers` ' +
        'WHERE `StudentenhuisID` = ' + id +
        ' AND `MaaltijdID` = ' + meal

    db.query(userIdQuery, (error, userIds) => {
        if (userIds.length !== 0) {
            //userIds is aantal users
            let selectUserData = 'SELECT `Voornaam`, `Achternaam`, `Email` FROM `user` WHERE ';
            for (var i = 0; i < userIds.length; i++) {
                console.log("for loop")
                selectUserData += ' `ID` = ' + userIds[i].UserID + ' OR'
            }

            console.log(selectUserData)
            selectUserData = selectUserData.slice(0, -1);
            selectUserData = selectUserData.slice(0, -1);
            console.log(selectUserData)

            db.query(selectUserData, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                    userData = rows
                }
            })
        } else {
            res.status(404).json({"message": "Geen deelnemer gevonden"})
        }
    });
},
    postDeelnemer(req,res,next){
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a post request!");
        var requestId = getid(req);
        var houseId = req.params.id
        var maaltijdId = req.params.maaltijd

        const insertQuery = 'INSERT INTO'


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
    deleteDeelnemer(req,res){
        console.log("ID: " + getid(req) + " is making a Delete request!");
        var houseId = req.params.id;
        var maaltijdId = req.params.maaltijdid
        var idFromToken = getid(req) || '';

        const getDeelnemers = 'SELECT * FROM deelnemers ' +
            'WHERE `UserID`=' + idFromToken + ' AND `StudentenhuisID`=' + houseId + ' AND `MaaltijdId`= '+ maaltijdId + '' ;
        const deleteQuery = 'DELETE FROM deelnemers Where `UserID`=' + idFromToken;

        console.log(getDeelnemers);
        console.log(deleteQuery);

        db.query(getDeelnemers, (error,deelnemers)=>{
            if (error){
                res.status(500).json(error.toString())
            }  else if (deelnemers.length === 0) {
                res.status(409).json({"message" : 'Niet gevonden (huisId of maaltijdId bestaat niet)'})
            } else if(idFromToken !== deelnemers[0].UserID) {
                res.status(409).json({"message" : 'Conflict (Gebruiker mag deze data niet verwijderen)'})
            } else {
                db.query(deleteQuery, (res,req) =>{
                    if (error){
                        res.status(500).json(error.toString())
                    } else {
                        res.status(200).json({"message" : 'Delete succedsgxcsvol'})
                    }
                })
            }
        })
    }
};