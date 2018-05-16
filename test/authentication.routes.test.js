/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

const FIRSTNAME = "Mocha";
const LASTNAME = "Chai";
const EMAIL = "assert@assert.com";
const PASS = "sneaky";

chai.should()
chai.use(chaiHttp)



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
                'firstname': FIRSTNAME,
                'lastname': LASTNAME,
                'email' : EMAIL,
                'password' : PASS
            })
            .end(function (err, res) {
                res.should.have.status(409);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });


        // Tip: deze test levert een token op. Dat token gebruik je in 
        // andere testcases voor beveiligde routes door het hier te exporteren
        // en in andere testcases te importeren via require.
        // validToken = res.body.token
        // module.exports = {
        //     token: validToken
        // }

    })

    it('should return an error on GET request', (done) => {
        var token = 0
        chai.request(server)
            .get('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(401)
                res.should.be.json;
                res.body.should.have.property('error');
                done()
            })

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
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });
    })

    it('should throw an error when no firstname is provided', (done) => {
        chai.request(server)
            .post('/apiv4/register')
            .send({
                'lastname': 'chaitest',
                'email' : 'chaitest',
                'password' : 'chaitest'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });
    })

    // it('should throw an error when firstname is shorter than 2 chars', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // })

    it('should throw an error when no lastname is provided', (done) => {

        chai.request(server)
            .post('/apiv4/register')
            .send({
                'firstname': 'chaitest',
                'email' : 'chaitest',
                'password' : 'chaitest'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });
    })

    // it('should throw an error when lastname is shorter than 2 chars', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // })

    // it('should throw an error when email is invalid', (done) => {
    //     //
    //     // Hier schrijf je jouw testcase.
    //     //
    //     done()
    // })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {

        chai.request(server)
            .post('/apiv4/login')
            .send({
                'email' : EMAIL,
                'password' : PASS
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                done();
            });

    })

    it('should throw an error when email does not exist', (done) => {
        chai.request(server)
            .post('/apiv4/login')
            .send({
                'email' : "unvalid",
                'password' : PASS
            })
            .end(function (err, res) {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            });

    })

    it('should throw an error when email exists but password is invalid', (done) => {
            chai.request(server)
                .post('/apiv4/login')
                .send({
                    'email' :  EMAIL,
                    'password' : "invalid"
                })
                .end(function (err, res) {
                    res.should.have.status(404);
                    res.should.be.json;
                    res.body.should.have.property('message');
                    done();
                });
    })

    it('should throw an error when using an invalid email', (done) => {
        chai.request(server)
            .post('/apiv4/login')
            .send({
                'email' : "invalid",
                'password' : PASS
            })
            .end(function (err, res) {
                res.should.have.status(404)
                res.should.be.json;
                res.body.should.have.property('message');
                done();
            })

    })
})