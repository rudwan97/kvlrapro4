const assert = require('assert');
const ApiError = require('./ApiError');

class Studentenhuis{

    constructor(name, address, id){

        try{
            assert(typeof (name) === 'string', 'name must be a string')
            assert(typeof (address) === 'string', 'address must be a string')
            assert(typeof(id) === 'string', 'id must be a string')

            assert(firstname.trim().length > 0, 'name must be at least 1 characters')
            assert(lastname.trim().length > 0, 'address must be at least 1 characters')
            assert(id.trim().length > 0, 'id must be a least 1 character')

        }
        catch(ex){
            throw(new ApiError(ex.toString(), 422))
    }

        this.name = {
            name: name.trim(),
            address: address.trim(),
            id: id.trim()
        }
    }

    getName(){
        return this.name.name;
    }
    getAdress(){
        return this.name.address;
    }
    getId(){
        return this.name.id;
    }
}