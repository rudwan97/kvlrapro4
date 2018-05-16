const db = require('../db/connector');
const jwt = require('jwt-simple');
const settings = require('../config');

function getid(req) {
    var token = (req.header('X-Access-Token')) || '';
    const payload = jwt.decode(token, settings.secretkey);
    return payload.sub;
}

module.exports = {
    getHousesById(req, res, next) {
        console.log("////////////NEW REQUEST////////////")
        console.log("ID: " + getid(req) + " is making a getHouse request");

        const id = req.params.id || '';
        const query = 'SELECT * FROM studentenhuis';
        const idQuery = 'SELECT * ' +
            'FROM `studentenhuis`' +
            ' WHERE `ID` = ' + id;

        console.log(query);

        if (id === '') {
            console.log(idQuery);
            db.query(query,
                (error, rows) => {
                    if (error) {
                        res.status(500).json(error.toString())
                        console.log("Request mislukt.");
                    } else {
                        res.status(200).json(rows)
                        console.log("Request succesvol!");
                    }
                })
        } else {
            db.query(idQuery,
                (error, rows) => {
                    if (error) {
                        res.status(500).json(error.toString())
                        console.log("Request mislukt.");
                    } else if(rows.length === 0){
                        res.status(404).json({
                            "message": "Geen studentenhuis gevonden",
                        })
                        console.log("Request mislukt.");
                    } else {
                        res.status(200).json(rows)
                        console.log("Request succesvol!");
                    }
                })
        }
    },
    addHouse(req, res) {
        console.log("////////////NEW REQUEST////////////")
        console.log("ID: " + getid(req) + " is making a addHouse request");

        var name = req.body.naam || ''; var adress = req.body.adres || ''; var id = getid(req) || '';

        const postquery = 'INSERT INTO `studentenhuis` (`Naam`,`Adres`,`UserID`)\n' +
            'VALUES(\'' + name + '\',\'' + adress + '\',' + id + ')'

       console.log(postquery);
        if (name !== '' && adress !== '') {
            db.query(postquery,
                (error) => {
                    if (error) {
                        res.status(500).json(error.toString());
                        console.log("Request mislukt.");
                    } else {
                        res.status(200).json({
                            message: 'Studentenhuis toegevoegd.'
                        });
                        console.log("Request succesvol!");
                    }
                })
        }else {
            res.status(412).json({ "message": 'Een of meer properties in de request body ontbreken of zijn foutief'})
            console.log("Request mislukt.");
        }
    },
    updateHouse(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a updateHouse request");

        var name = req.body.naam || ''; var adress = req.body.adres || ''; var houseId = req.params.id; var id = getid(req) || '';
        var olduserid;

            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId;

            console.log(useridquery);

            db.query(useridquery,
                (error, rows) => {
                    if (error) {
                        res.status(500).json(error.toString())
                        console.log("Request mislukt.")
                    }else if (rows.length === 0) {
                        res.status(404).json({message : "Niet gevonden (huisId bestaat niet)"});
                        console.log("Request mislukt.")
                    } else {
                        olduserid = rows[0].UserID;
                        const updatequery = 'UPDATE studentenhuis SET `Naam` = \'' + name + '\', `Adres` = \'' + adress + '\' WHERE `UserID`= ' + id + ' AND `ID` = ' + houseId + '';
                        console.log(updatequery);

                        if (name !== '' && adress !== '') {
                            db.query(updatequery,
                                (error) => {
                                    if (error) {
                                        res.status(500).json(error.toString());
                                        console.log("Request mislukt.")
                                    } else if (olduserid !== id) {
                                        res.status(409).json({message: "Conflict (Gebruiker mag deze data niet wijzigen)"});
                                        console.log("Request mislukt.")
                                    } else {
                                        res.status(200).json({message: 'Studentenhuis geupdate.'});
                                        console.log("Request succesvol!")
                                    }
                                })
                        }else {
                            res.status(412).json({message: 'Een of meer properties in de request body ontbreken of zijn foutief'});
                            console.log("Request mislukt.");
                        }
                    }
                })

    },
    deleteHouse(req, res) {
        console.log("////////////NEW REQUEST////////////");
        console.log("ID: " + getid(req) + " is making a deleteHouse request!");
        var houseId = req.params.id; var idFromToken = getid(req) || ''; var idFromCreator; var houseFound = true;

            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId
            console.log(useridquery)

            db.query(useridquery,
                (error, rows) => {
                    if (error) {
                        res.status(500).json(error.toString())
                        console.log("Request mislukt.");
                    } else if (rows.length === 0 || rows.size === 0) {
                        res.status(404).json({message: "Niet gevonden (huisId bestaat niet)"});
                        houseFound = false;
                        console.log("Request mislukt.");
                    } else {
                        idFromCreator = rows[0].UserID;
                        const deletequery = 'DELETE FROM studentenhuis WHERE `UserID`= ' + idFromToken + ' AND `ID` = ' + houseId;
                        console.log(deletequery);

                        db.query(deletequery,
                            (error) => {
                                if (error) {
                                    res.status(500).json(error.toString())
                                    console.log("Request mislukt.");
                                } else if (idFromCreator !== idFromToken) {
                                    res.status(409).json({message: "Conflict (Gebruiker mag deze data niet verwijderen)"});
                                    console.log("Request mislukt.");
                                } else {
                                    res.status(200).json({message: 'Studentenhuis gedelete.'});
                                    console.log("Request succesvol!")
                                }
                            })
                    }
                })
    }
};