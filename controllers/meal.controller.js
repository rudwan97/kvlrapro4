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
function getStudentHouseFromId(houseId){
    const getQuery = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
    console.log(getQuery);
    db.query(getQuery, (error,rows,fields) =>{
        if (error) {
            console.log("Error bij het ophalen van id uit studentenhuis bij getmeal")
        }else if (rows.size === 0){
            console.log("Geen huis gevonden door het gethousebyid functie")
        } else {
            console.log("studenthuis gevonden")
            return true;
        }
    })
}
function getStudent(houseId){
    const getQuery = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
    console.log(getQuery);
    db.query(getQuery, (error,rows,fields) =>{
        if (error) {
            console.log("Error bij het ophalen van id uit studentenhuis bij getmeal")
        }else if (rows.size === 0){
            console.log("Geen huis gevonden door het gethousebyid functie")
        } else {
            console.log("studenthuis gevonden")
            return true;
        }
    })
}
function getCreatorOfHouse(houseId){
    const getQuery = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
    console.log(getQuery);
    db.query(getQuery, (error,rows,fields) =>{
        if (error) {
            console.log("Error bij het ophalen van userid uit studentenhuis bij getmeal")
        }else if (rows.size === 0){
            console.log("Geen userid gevonden door het gethousebyid functie")
        } else {
            console.log("userid gevonden")
            console.log(rows[0].UserID);
            return rows[0].UserID;
        }
    })
}
module.exports = {
    addMeal(req, res) {
        console.log("ID: " + getid(req) + " is making a post request!");
        var houseId = req.params.id;
        var houseExists = false;
        var creatorId;
        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten
        var allergic = req.body.allergie
        var price = req.body.prijs
        var userIdFromToken = getid(req) || '';

        // creatorId = getCreatorOfHouse(houseId);
        // houseExists = getStudentHouseFromId(houseId);

        const getQuery = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        console.log(getQuery);
        db.query(getQuery, (error,rows,fields) =>{
            if (error) {
                console.log("Error bij het ophalen van id uit studentenhuis bij getmeal")
            }else if (rows.size === 0){
                console.log("Geen huis gevonden door het gethousebyid functie")
            } else {
                console.log("studenthuis gevonden")
                houseExists = true;
            }
        })

        const getQuery2 = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        console.log(getQuery2);
        db.query(getQuery2, (error,rows,fields) =>{
            if (error) {
                console.log("Error bij het ophalen van userid uit studentenhuis bij getmeal")
            }else if (rows.size === 0){
                console.log("Geen userid gevonden door het gethousebyid functie")
            } else {
                console.log("userid gevonden")
                console.log(rows[0].UserID);
               creatorId = rows[0].UserID;
            } 

        })


        const postquery = "INSERT " +
            "INTO `maaltijd` (`Naam`,`Beschrijving`," +
            "`Ingredienten`,`Allergie`,`Prijs`,`UserID`,`StudentenhuisID`) " +
            "VALUES (\'" + name + "\',\'" + ingredients+ "\',\'"+description+"\'," +
            "\'"+allergic+"\',"+price+","+4+","+houseId + ")";
        console.log(postquery);

        db.query(postquery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.json({
                        message: 'Maaltijd toegevoegd.'
                    })
                }
            })

        console.log("De id van de creator van het gekozen houseId"+ creatorId);
        console.log(houseExists);

        // if (houseExists){
        //
        // } else{
        //     res.json("Geen huis gevonden bij het meegegeven id")
        // }
    }
}