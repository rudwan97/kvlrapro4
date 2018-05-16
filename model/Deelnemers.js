const assert = require('assert');
const ApiError = require('./ApiError');

class Maaltijd{

    constructor(firstname, lastname, email){

        try{
            assert(typeof (firstname) === 'string', 'firstname must be a string')
            assert(typeof (lastname) === 'string', 'lastname must be a string')
            assert(typeof(email) === 'string', 'email must be a string')


            assert(firstname.trim().length > 0, 'firstname must be at least 1 character')
            assert(lastname.trim().length > 0, 'lastname must be at least 1 character')
            assert(email.trim().length > 0, 'email must be a least 1 character')

        }
        catch(ex){
            throw(new ApiError(ex.toString(), 422))
    }

        this.info = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.trim()
        }
    }

    getFirstName(){
        return this.info.firstname;
    }
    gettLastName(){
        return this.info.lastname;
    }
    getEmail(){
        return this.info.email;
    }
}