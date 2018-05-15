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
        console.log("////////////NEW REQUEST////////////")
        console.log("ID: " + getid(req) + " is making a post request!");
        var requestId = getid(req);
        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || '');
        var houseId = req.params.id;


        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;

        db.query(getHouse,(error,creatorResult)=> {
            console.log("Er is " + creatorResult.length + " huis gevonden met het meegegeven id")
        if (creatorResult.length !==0) {
            if (creatorResult[0].ID == houseId) {
                console.log("Het huis met de meegegeven id is gevonden! ID ="+creatorResult[0].ID);
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
        }else {
            res.status(500).json({error:"Er bestaat geen huis met het meegegeven id"})
            console.log("Huis niet gevonden")
        }
        })
    }

}