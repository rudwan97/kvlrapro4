//
// Authentication using JSON Web Token (JWT)
// Save this e.g. as ./util/auth/authentication.js
//
const settings = require('../config')
const moment = require('moment')
const jwt = require('jwt-simple')

//
// Encode (from username to token)
//
function encodeToken(userid) {
    console.log("Creating token");
    const playload = {
        sub: userid   // or any object you choose!
    }
    console.log("New token generated with ID " + userid);
    return jwt.encode(playload, settings.secretkey)

}

function decodeToken(token, callback) {
    console.log("Token found");

    try {
        const payload = jwt.decode(token, settings.secretkey)
        const now = moment().unix();
        const id = payload.sub;
        console.log("ID: " + id + " is making a request, id obtained from token");
        if (now > payload.exp) {
            callback('Token has expired!', null)
        } else {
            callback(null, payload)
        }
    } catch (err) {
        callback(err, null)
    }

}

module.exports = {
    encodeToken,
    decodeToken
}