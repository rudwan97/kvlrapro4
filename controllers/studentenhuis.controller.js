const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth =  require('../auth/authentication');
const jwt = require('jwt-simple')
const settings = require('../config')

function getid(req){
    var token = (req.header('X-Access-Token')) || '';

    const payload = jwt.decode(token, settings.secretkey)
    const id = payload.sub;
    return id;
}

function getUserIdByHouseId(houseid){
        const useridquery = 'SELECT * ' +
            'FROM studentenhuis WHERE ID=' + houseid;
        console.log(useridquery)
        db.query(useridquery,
            function(error, rows, fields){
                if (error) {
                    console.log("error met het ophalen van id met house nummer")
                } else {
                    console.log('eerste delete query')
                    console.log(rows[0])
                    return rows[0].UserID;
                    console.log("oorspronkelijke userid: " + olduserid);
                }
            })

}

module.exports = {
    getHousesById(req,res,next)  {

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

        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var id = getid(req) || '';

        const postquery = 'INSERT INTO `studentenhuis` (`Naam`,`Adres`,`UserID`)\n' +
            'VALUES(\''+ name +'\',\''+adress +'\',' + id + ')'
        console.log(postquery);

        db.query(postquery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.json({message: 'Studentenhuis toegevoegd.'})
                }
            })
    },
    updateHouse (req, res) {
        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var houseId = req.params.id;
        var id = getid(req)|| '';
        var olduserid;

        try {


            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId + ' AND ADRES = \'' + adress + '\' AND Naam = \'' + name + '\''
            console.log(useridquery)
            db.query(useridquery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } else {
                        console.log(olduserid = rows[0].UserID);
                        olduserid = rows[0].UserID;
                        console.log("oorspronkelijke userid: " + olduserid);
                    }
                })
        }catch (e) {

        }

        const updatequery = 'UPDATE studentenhuis SET `Naam` = \''+name+'\', `Adres` = \''+adress+'\' WHERE `UserID`= '+ id +' AND `ID` = '+houseId+'';

        console.log(updatequery) ;
        db.query(updatequery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                }
                else if(olduserid !== id){
                    res.json({message:"niet geautoriseerd."})
                }else {
                    res.json({message: 'Studentenhuis geupdate.'})
                }

            })
    },

};
