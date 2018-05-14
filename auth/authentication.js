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
    console.log("encoding token....");
    const playload = {
        sub: userid   // or any object you choose!
    }
    console.log("encoded token");
    return jwt.encode(playload, settings.secretkey)

}

function decodeToken(token, callback) {
    console.log("decoding token....");
    try {
        const payload = jwt.decode(token, settings.secretkey)
        console.log(payload)
        const now = moment().unix();
        if (now > payload.exp) {
            callback('Token has expired!', null)
        } else {
            callback(null, payload)
        }
    } catch (err) {
        callback(err, null)
    }
    console.log("decoded token")
}

module.exports = {
    encodeToken,
    decodeToken
}