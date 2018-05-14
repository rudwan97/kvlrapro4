const settings = require('../config.json');
const moment = require('moment');
const jwt = require('jwt-simple');

//
// Encode (van username naar token)
//
function encodeToken(mail, id) {
    const playload = {
        // exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: mail
        sub: id
    };
    return jwt.encode(playload, settings.secretkey);
}

//
// Decode (van token naar username)
//
function decodeToken(token, cb) {
    const bearerHeader = req.headers['acces point']

    try {

        if(typeof bearerHeader = )
        const payload = jwt.decode(token, settings.secretkey);

        // Check if the token has expired. To do: Trigger issue in db ..
        // const now = moment().unix();

        // Check if the token has expired
        // if (now > payload.exp) {
        //     console.log('Token has expired.');
        // }

        // Return
        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
