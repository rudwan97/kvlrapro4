const express = require('express');
const router = express.Router();
const db = require('../db/connector');
const auth = require('../auth/authentication');
const housecontroller = require('../controllers/studentenhuis.controller');
const mealcontroller = require('../controllers/meal.controller');
const deelnemercontroller = require('../controllers/deelnemer.controller');
const usercontroller = require('../controllers/user.controller');

router.all(new RegExp("[^(/login|register)]"), function(req, res, next) {
    console.log("////////////VALIDATING TOKEN////////////");
    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401)).json({
                error:
                "Niet geautoriseerd (geen valid token)"
            });
        } else {
            next();
        }
    });
});

router.post('/register', usercontroller.register);
router.post('/login', usercontroller.login);

router.post('/studentenhuis', housecontroller.addHouse);
router.put('/studentenhuis/:id', housecontroller.updateHouse);
router.get('/studentenhuis/:id?', housecontroller.getHousesById);
router.delete('/studentenhuis/:id', housecontroller.deleteHouse);

router.post('/studentenhuis/:id/maaltijd', mealcontroller.addMeal)
router.delete('/studentenhuis/:id/maaltijd/:mealid', mealcontroller.deleteMeal);
router.get('/studentenhuis/:id/maaltijd/:maaltijd?',mealcontroller.getMeal);
router.put('/studentenhuis/:id/maaltijd/:mealid', mealcontroller.putMeal)

router.get('/studentenhuis/:id/maaltijd/:maaltijd/deelnemers', deelnemercontroller.getDeelnemers);
router.delete('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers', deelnemercontroller.deleteDeelnemer);

module.exports = router;