const db = require('../db/connector');
const jwt = require('jwt-simple');
const settings = require('../config');

function getid(req) {
    var token = (req.header('X-Access-Token')) || '';
    const payload = jwt.decode(token, settings.secretkey);
    return payload.sub;
}

module.exports = {
    addMeal(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a addMeal request!");
        var requestId = getid(req);
        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var allergy = req.body.allergie || '';
        var ingredients = req.body.ingredienten || '';
        let price = Number(req.body.prijs || '');
        var houseId = req.params.id;

        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        console.log(getHouse);

        if (name !== '' && description !== '' && ingredients !== '' && allergy !== '' && price !== '') {
            db.query(getHouse, (error, houseResult) => {
                if (houseResult.length !== 0) {
                    if (houseResult[0].ID == houseId) {
                        console.log('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)');
                        db.query('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)',
                            [name, description, ingredients, allergy, price, requestId, houseId],
                            (errorMeals, resultMeals) => {
                                if (error) {
                                    console.log(error)
                                    res.status(500).json({"error": "Internal error"})
                                    console.log("Request mislukt.")
                                }
                                else {
                                    res.status(200).json({"message": "De maaltijd is succesvol toegevoegd!"});
                                    console.log("Request succesvol")
                                }
                            })
                    } else {
                        res.status(404).json("Niet gevonden huisId bestaat niet)")
                        console.log("Request mislukt.")
                    }
                } else {
                    res.status(404).json({message: "Niet gevonden (huisId bestaat niet)"})
                    console.log("Request mislukt.")
                }
            })
        }else{
            res.status(412).json({"message": "Een of meer properties in de request body ontbreken of zijn foutief"})
            console.log("Request mislukt.")
        }
    },
    deleteMeal(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a deleteMeal request!");

        var requestId = getid(req); var houseId = req.params.id; var mealId = req.params.mealid;
        console.log("id uit endpoint van maaltijd is" + mealId);

        const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
        const getMeals = 'SELECT * FROM maaltijd WHERE `ID`=' + mealId + ' AND `StudentenhuisID` = ' + houseId;
        const deleteQuery = 'DELETE FROM maaltijd WHERE `ID` = ' + mealId + ' AND `StudentenhuisID` = '  + houseId;

        console.log(getHouse);
        console.log(getMeals);
        console.log(deleteQuery);
        db.query(getHouse, (error, houseResult) => {
            db.query(getMeals, (error, mealsResult) => {


                    if (houseResult.length !== 0 && mealsResult.length !== 0) {
                        if (mealsResult[0].UserID === requestId) {

                            if (mealsResult[0].ID == mealId) {

                                db.query(deleteQuery, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        res.status(500).json({"error": "Internal error"})
                                        console.log("Request mislukt.")
                                    }
                                    else {
                                        res.status(200).json({"message": "De maaltijd is succesvol gedelete!"});
                                        console.log("Request succesvol")
                                    }
                                })
                            }else {
                                res.status(404).json({"error": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                                console.log("Request mislukt.")
                            }
                        } else {
                            res.status(409).json({"error": "Conflict (Gebruiker mag deze data niet verwijderen)"})
                            console.log("Request mislukt.")
                        }
                        } else {
                    res.status(404).json({"error": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                    console.log("Request mislukt.")
                }
            })
        })
    },
    getMeal(req, res, next) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a getMeal request!");
        const meal = req.params.maaltijd || ''; const id = req.params.id || '';

        if (meal == '') {
            console.log('SELECT * ' +
                'FROM `maaltijd` ' +
                'WHERE `StudentenhuisID` = ' + id);
            db.query('SELECT * ' +
                'FROM `maaltijd` ' +
                'WHERE `StudentenhuisID` = ' + id, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString());
                    console.log("Request mislukt.");
                } else {
                    res.status(200).json(rows)
                    console.log("Request succesvol!.")
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
                    console.log("Request mislukt.")
                }else if(rows.length === 0){
                    res.status(404).json({"message" : "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                    console.log("Request mislukt.")
                } else {
                    res.status(200).json(rows)
                    console.log("Request Succesvol!!.")
                }
            })
        }
    },
    putMeal(req, res, next) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a putMeal request!");
        var requestId = getid(req); var name = req.body.naam || ''; var description = req.body.beschrijving || ''; var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || ''; let price = Number(req.body.prijs || ''); var houseId = req.params.id; var mealid = req.params.mealid;

        if (name !== '' && description !== '' && ingredients !== '' && allergy !== '' && price !== '') {
            const getHouse = 'SELECT * FROM studentenhuis WHERE `ID` = ' + houseId;
            const getMeals = 'SELECT * FROM maaltijd WHERE `ID` = ' + mealid;
            console.log(getHouse);
            console.log(getMeals);

            db.query(getHouse, (error, houseResult) => {
                db.query(getMeals, (error, mealsResult) => {
                    if (houseResult.length !== 0) {
                        if (mealsResult.length !== 0) {
                            if (requestId === mealsResult[0].UserID) {
                                console.log("Executing update query.")
                                db.query('UPDATE maaltijd SET `Naam` = ?, `Beschrijving` = ?, `Ingredienten` = ?, `Allergie` = ?, `Prijs` = ?, `UserID` = ?, `StudentenhuisID` = ? WHERE `ID` = ?',
                                    [name, description, ingredients, allergy, price, requestId, houseId, mealid],
                                    (error) => {

                                        if (error) {
                                            console.log(error)
                                            res.status(500).json({"error": "Internal error"})
                                            console.log("Request mislukt.")
                                        }
                                        else {
                                            res.status(200).json({"message": "De maaltijd is succesvol upgedate!"});
                                            console.log("Request succesvol!")
                                        }
                                    })
                            } else {
                                res.status(409).json({"message": "Conflict (Gebruiker mag deze data niet wijzigen)"})
                                console.log("Request mislukt.")
                            }
                        } else {
                            res.status(404).json({"message": "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                            console.log("Request mislukt.")
                        }
                    } else {
                        res.status(404).json({message: "Niet gevonden (huisId of maaltijdId bestaat niet)"})
                        console.log("Request mislukt.")
                    }
                })
            })
        }else {
            res.status(412).json({message: "Een of meer properties in de request body ontbreken of zijn foutief"})
            console.log("Request mislukt.")
        }
    }
}