/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

const User = require('../modules/')

//All info needed for tests
//Token
const tokenEncoded = require('../auth/authentication').encodeToken
const tokenDecoded = require('../auth/authentication').decodeToken

chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken

//JWT token testing from Diederich
describe('V1 Roommate', () => {
    var token = null;

    before(function(done) {
        chai.request(server)
            .post('../routes/apiv4')
            .send(
                {
                    "email": "testcase@test.com",
                    "password":"secret"
                })
            .end(function(err, res) {
                token = res.body.token; 
                done();
            });
    });

})


describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //


        // Tip: deze test levert een token op. Dat token gebruik je in 
        // andere testcases voor beveiligde routes door het hier te exporteren
        // en in andere testcases te importeren via require.
        // validToken = res.body.token
        // module.exports = {
        //     token: validToken
        // }
        done()
    })

    it('should return an error on GET request', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when the user already exists', (done) => {
        assert.throws(() => new user  )
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when no firstname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when no lastname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when email is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when email does not exist', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when email exists but password is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when using an invalid email', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

})