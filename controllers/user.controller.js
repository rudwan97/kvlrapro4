const db = require('../db/connector');
const auth = require('../auth/authentication');


module.exports = {
    login(req, res) {
        console.log("////////////LOGIN REQUEST////////////");
        var mail = req.body.email || '';
        var password = req.body.password || '';
        let resultfromquery = [];
        let id;
        let email;
        let pass;
        console.log("Checking database for user.")
        const query = 'SELECT `ID`, `Email`,`Password` FROM `user` WHERE `Email` =\'' + mail + '\' AND `Password` = \'' + password + '\'';
        console.log(query);
        db.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
                console.log("Log in mislukt.")
            } else if (rows.length === 0) {
                res.status(404).json({"message": 'User not found, Please register first'})
                console.log("Log in mislukt.")
            } else if (mail === '' && email === '') {
                res.status(412).json({message: "Een of meer properties in de request body ontbreken of zijn foutief"})
                console.log("Log in mislukt.")
            }
            else {
                resultfromquery = rows;
                id = resultfromquery[0].ID;
                email = resultfromquery[0].Email;
                pass = resultfromquery[0].Password;
                console.log("Adding user to database");
                if (resultfromquery !== 0) {
                    res.status(200).json({
                        "token": auth.encodeToken(id),
                        "email": email
                    });
                    console.log("Login succesfull.")
                }

            }
        });
    },
    register(req, res) {
        console.log("////////////REGISTER REQUEST////////////")
        console.log("attempting to register...");
        var firstname = req.body.firstname || ''
        var lastname = req.body.lastname|| ''
        var mail = req.body.email|| ''
        var password = req.body.password|| ''
        const insertQuery = 'INSERT INTO `user` ' +
            '(`Voornaam`, `Achternaam`, `Email`, `Password`)' +
            ' VALUES (\'' + firstname + '\', \'' + lastname + '\', \'' + mail + '\', \'' + password + '\');';
        console.log("inserting sqlquery...");
        console.log(insertQuery);
        if (firstname !== '' && lastname !== '' && mail !=='' && password !== '') {
            db.query('SELECT * FROM user WHERE `Email` = \''+ mail + '\'', (error,selectRows) =>{
                if (selectRows.length !== 1) {
                    db.query(insertQuery, (error, insertRows, fields) => {
                        if (error) {
                            res.status(500).json(error.toString())
                            console.log("Registreren gestopt");
                        } else {
                            res.status(200).json({
                                message: "Register succesfull, /login with mail and password to obtain api key"
                            })
                            console.log("account aangemaakt")
                        }
                    });
                }else{
                    res.status(409).json({"message" : "Account bestaat al"})
                }
            })

        } else {
            res.status(412).json({
                'message': "Een of meer properties in de request body ontbreken of zijn foutief"
            });
            console.log("Registreren gestopt");
        }
    }
};