const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const correctToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjR9.3Ct8wyd-7Ya0fEBzVXuAtHp2iwKqAfQPFBoLsDW-1yY"

chai.should()
chai.use(chaiHttp)

describe('Meal GET', () => {

    it('should throw an error when using invalid JWT token', (done) => {
        var token = '0'
        chai.request(server)
            .get('/apiv4/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it('should return when using a valid token', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis/1/maaltijd')
            .set('x-access-token', correctToken)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })

    it('should return maaltijd with existing huisid and mealid', (done) => {

        chai.request(server)
            .get('/apiv4/studentenhuis/1/maaltijd/150')
            .set('x-access-token', correctToken)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done()
            })
    })

    it('should return an error when using an invalid huisId', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis/3245123342/maaltijd/1')
            .set('x-access-token', correctToken)
            .end(function (err, res) {
                res.should.have.status(404);
                done()
            })
    })
})

describe('Meal POST', () => {

    it('should throw an error when using invalid JWT token', (done) => {
        const token = "0"
        chai.request(server)
            .post('/apiv4/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })


    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .post('/apiv4/studentenhuis/1/maaltijd')
            .set('x-access-token', correctToken)
            .send(
                {
                    "beschrijving": "1",
                    "ingredienten": "1",
                    "allergie": "1",
                    "prijs": 1
                })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

    it('should throw an error when allergy and price are missing', (done) => {
        chai.request(server)
            .post('/apiv4/studentenhuis/1/maaltijd')
            .set('x-access-token', correctToken)
            .send(
                {
                    "naam": "1",
                    "beschrijving": "1)",
                    "ingredienten": "1",

                })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });
})


