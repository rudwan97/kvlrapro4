
const settings = require('../config')
const jwt = require('jwt-simple')

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
        const id = payload.sub;
        console.log("ID: " + id + " obtained from token, acces granted");
        callback(null, payload)
    } catch (err) {
        callback(err, null)
    }
}

module.exports = {
    encodeToken,
    decodeToken
};