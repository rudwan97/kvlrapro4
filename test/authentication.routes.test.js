/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)


//JWT token testing from Diederich
describe('V1 Roommate', () => {
    var token = null;

    before(function(done) {
        chai.request(server)
            .get('/studentenhuis')
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

    //Er kan maar 1 email een account aan gemaakt worden
    //Dus testen met 200 kunnen alleen slagen met een nieuw email
    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/apiv4/register')
            .send({
                'firstname': 'chaitest',
                'lastname': 'chaitest',
                'email' : 'chaitest',
                'password' : 'chaitest'
            })
            .end(function (err, res) {
                res.should.have.status(409);
                done();
            });


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

        // chai.request(server)
        done()
    })

    it('should throw an error when the user already exists', (done) => {

        chai.request(server)
            .post('/apiv4/register')
            .send({
                'firstname': 'chaitest',
                'lastname': 'chaitest',
                'email' : 'chaitest',
                'password' : 'chaitest'
            })
            .end(function (err, res) {
                res.should.have.status(409);
                done();
            });
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
        // chai.request(server)
        //     .get('')
        //     .send(
        //         {
        //             "email": "testcase@test.com",
        //             "password":"secret"
        //         })
        //     .end(function(err, res) {
        //         token = res.body.token;
        //         done();
        //     });
        // done()
    })

})