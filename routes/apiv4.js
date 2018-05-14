const express = require('express');
const users = require('../modules/user_ds');
const router = express.Router();
const db = require('../db/connector');
const auth =  require('../auth/authentication');

let payloadid;

router.all( new RegExp("[^(/login|register)]"), function (req, res, next) {

    console.log("VALIDATE TOKEN")

    var token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(token, (err, payload) => {
        payloadid= payload.sub
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else {
            next();
        }
    });
});

// TODO: Zorgen dat er niet ingelogd kan worden met lege waarden
router.route('/login')

    .post( function(req, res) {

        console.log("login request..");


        var mail = req.body.mail || '';
        var password = req.body.password || '';

        let resultfromquery = [];
        let id;
        let email;
        let pass;
        console.log("checking if user exists..")
        const query = 'SELECT `ID`, `Email`,`Password` FROM `user` WHERE `Email` =\''+ mail + '\' AND `Password` = \'' + password + '\'';
        console.log("executing query...")
        console.log(query);
        db.query(query,
            (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            }
                else if(rows.length ===0){
                    res.status(500).json('User not found, Please register first')
                } else {
                //res.status(200).json(rows)
                 console.log(rows);
                 resultfromquery = rows;

                 console.log("getting user data from database...")
                 id = resultfromquery[0].ID;
                 email = resultfromquery[0].Email;
                 pass = resultfromquery[0].Password;
                 console.log(id + email + pass);

                if (resultfromquery!==0){
                    res.status(200).json({"token" : auth.encodeToken(id), "email" : email});
                }
                console.log("login succesfull, token sent")
            }
        });
    });

// TODO: Zorgen dat er niet geregistreerd kan worden met lege waarden
router.route('/register')

    .post( function(req, res) {

        console.log("attempting to register...");
        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var mail = req.body.mail
        var password = req.body.password


        const insertQuery = 'INSERT INTO `user` ' +
            '(`Voornaam`, `Achternaam`, `Email`, `Password`)' +
            'VALUES (\'' + firstname + '\', \'' + lastname + '\', \'' + mail + '\', \'' + password + '\');';

        console.log("inserting sqlquery...");
        console.log(insertQuery);
        if (!isEmpty(firstname), !isEmpty(lastname, !isEmpty(mail, !isEmpty(password)))) {

            db.query(insertQuery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    }
                    else {
                        res.status(200).json({message: "register succesfull, login to obtain api key"})
                        console.log("account aangemaakt")
                    }
                });
        }else{
            res.status(500).json("Een van de velden is leeg");
        }

    });

router.get('/studentenhuis/:id?', (req,res,next) => {

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
});
router.get('/studentenhuis/:id/maaltijd/:maaltijd?', (req,res,next) => {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    if (meal == '') {
        db.query('SELECT * ' +
            'FROM `maaltijd` ' +
            'WHERE `StudentenhuisID` = ' + id,
            (error, rows, fields) => {
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
             ' AND `ID` = '+ meal);
        db.query('SELECT * FROM `maaltijd` ' +
            'WHERE `StudentenhuisID` = ' + id +
            ' AND `ID` = '+ meal,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    }
});
router.get('/studentenhuis/:id/maaltijd/:maaltijd/deelnemers', (req,res,next) => {
    const meal = req.params.maaltijd || '';
    const id = req.params.id || '';
    let users=[];
    let userid=[];


        db.query('SELECT UserID ' +
            'FROM `deelnemers` ' +
            'WHERE `StudentenhuisID` = ' + id +
            ' AND `MaaltijdID` = '+ meal,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    console.log(rows)
                    users = rows;
                    for (let i = 0; i < users.length; i++){
                        console.log(users[i].UserID);
                        userid[i] = users[i].UserID;
                        console.log(userid)
                    }
                }
            });
        db.query('SELECT `Voornaam`, `Achternaam`, `Email` FROM `user` WHERE `ID` = ' + userid[0],
        (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            } else {
                res.status(200).json(rows)
                console.log(rows)
            }
        })
});

//TODO: Zorgen dat er niet gepost kan worden met lege bodys
//TODO: Correcte fout afhandeling
router.route('/studentenhuis')

    .post( function(req, res) {

        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var id = payloadid || '';

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
    });

router.route('/studentenhuis/:id')
    .put(function (req, res) {
        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var houseId = req.params.id;
        var id = payloadid || '';
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
                    olduserid = rows[0].UserID;
                    console.log("oorspronkelijke userid: " + olduserid);
                }
            })
    }catch (e) {
            
        }

        const updatequery = 'UPDATE studentenhuis SET `Naam` = \''+name+'\', `Adres` = \''+adress+'\' WHERE `UserID`= \''+ id +'\' AND `ID` = \''+houseId+'\''

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
    });

router.route('/studentenhuis/:id')
    .delete(function (req,res) {

        var name = req.body.naam || '';
        var adress = req.body.adres || '';
        var houseId = req.params.id;
        var id = payloadid || '';
        var olduserid;
        try {
            const useridquery = 'SELECT * ' +
                'FROM studentenhuis WHERE ID=' + houseId + ' ' +
                'AND ADRES = \'' + adress + '\' ' +
                'AND Naam = \'' + name + '\''
            console.log(useridquery)
            db.query(useridquery,
                (error, rows, fields) => {
                    if (error) {
                        res.status(500).json(error.toString())
                    } else {
                        olduserid = rows[0].UserID;
                        console.log("oorspronkelijke userid: " + olduserid);
                    }
                })
        }catch (e) {

        }
        const deletequery = 'DELETE FROM studentenhuis WHERE `UserID`= '+ id +' AND `ID` = '+houseId

        console.log(deletequery) ;
        db.query(deletequery,
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                }
                else if(olduserid !== id){
                    res.json({message:"niet geautoriseerd."})
                }else {
                    res.json({message: 'Studentenhuis gedelete.'})
                }

            })





    });

function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = router;