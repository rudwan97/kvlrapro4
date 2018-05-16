const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

const invalidToken = "0";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjR9.3Ct8wyd-7Ya0fEBzVXuAtHp2iwKqAfQPFBoLsDW-1yY"

chai.should()
chai.use(chaiHttp)

describe('Studentenhuis API POST', () => {

    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/apiv4/studentenhuis')
            .set('x-access-token', invalidToken)
            .send({
                'naam': 'bliep',
                'adres': 'bloep'
            })
            .end(function(err,res){
                res.should.have.status(401);
                done();
            });

    });

    it('should return a studentenhuis when posting a valid object', (done) => {
        chai.request(server)
            .post('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'naam': 'hoi123',
                'adres': 'hoistraat28'
            })
            .end(function(err,res){
                res.should.have.status(200);
                done();
            });
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjR9.3Ct8wyd-7Ya0fEBzVXuAtHp2iwKqAfQPFBoLsDW-1yY"
        chai.request(server)
            .post('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'unvalid': 'Avans',
                'adres': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
            .post('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'name': 'Avans',
                'unvalid': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    })
})

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //

        chai.request(server)
            .get('/apiv4/studentenhuis')
            .set('x-access-token', invalidToken)
            .end(function(err,res){
                res.should.have.status(401);
                done();
            });
    });


    it('should return all studentenhuizen when using a valid token', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .end(function(err,res){
                res.should.have.status(200);
                done();
            });
    });
});

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis/1')
            .set('x-access-token', invalidToken)
            .end(function(err,res){
                res.should.have.status(401)
                done()
            })
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis/1')
            .set('x-access-token', token)
            .end(function(err,res){
                res.should.have.status(200)
                done()
            })

    })

    it('should return an error when using an non-existing huisId', (done) => {
        chai.request(server)
            .get('/apiv4/studentenhuis/99999999')
            .set('x-access-token', token)
            .end(function(err,res){
                res.should.have.status(404)
                done();
            });

    });
});

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
      chai.request(server)
          .put('/apiv4/studentenhuis')
          .set('x-access-token', invalidToken)
          .send({
              'naam': 'ke',
              'adres': 'vin'
          })
          .end(function(err,res){
              res.should.have.status(401)
              done();
          });
    });

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        chai.request(server)
            .put('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'naam': 'vin',
                'adres': 'ke'
            })
        .end(function(err,res){
            res.should.have.status(200)
            done();
        });
    });

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .put('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'invalid': 'qwerty',
                'adres': 'Coole Straattnaam'
            })
            .end(function(err, res){
                res.should.have.status(412)
                done()
            })
    })

    it('should throw an error when adres is missing', (done) => {

        chai.request(server)
            .put('/apiv4/studentenhuis')
            .set('x-access-token', token)
            .send({
                'naam': 'Coole naam',
                'invalid': 'qwerty'
            })
            .end(function(err, res){
                res.should.have.status(412)
                done()
            })
    })
})

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .delete('/apiv4/studentenhuis/2')
            .set('x-access-token', invalidToken)
            .send({
                'naam': 't3st',
                'adres': 't3stlaan'
            })
            .end(function(err,res){
                res.should.have.status(401);
                done();
            });

    });
})