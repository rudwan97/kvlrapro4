const assert = require('assert');
const ApiError = require('./ApiError');

class Maaltijd{

    constructor(name, description, ingredients, allergies, price){

        try{
            assert(typeof (name) === 'string', 'name must be a string')
            assert(typeof (description) === 'string', 'description must be a string')
            assert(typeof(ingredients) === 'string', 'ingredients must be a string')
            assert(typeof(allergies) === 'string', 'allergies must be a string')
            assert(typeof(price) === 'string', 'price must be a string')

            assert(name.trim().length > 0, 'name must be at least 1 character')
            assert(description.trim().length > 0, 'address must be at least 1 character')
            assert(ingredients.trim().length > 0, 'id must be a least 1 character')
            assert(allergies.trim().length > 0, 'allergies must be at least 1 character ')
            assert(price.trim().length > 0, 'price must be at least 1 character')
        

        }
        catch(ex){
            throw(new ApiError(ex.toString(), 422))
    }

        this.info = {
            name: name.trim(),
            description: description.trim(),
            ingredients: ingredients.trim(),
            allergies: allergies.trim(),
            price: price.trim()
        }
    }

    getName(){
        return this.info.name;
    }
    getDescription(){
        return this.info.description;
    }
    getIngredients(){
        return this.info.ingredients;
    }
    getAllergies(){
        return this.info.allergies;
    }
    getPrice(){
        return this.info.price;
    }
}