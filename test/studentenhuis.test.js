const chai = require('chai');
const assert = require('assert');
const Studentenhuis = require('../routes/apiv4');

chai.should();

describe ('Studentenhuis', () => {

    it('Should accept exactly two arguments', (done) =>{
        //All invalid empty arguments
        //Studentenhuis should have a: naam and adres
        assert.throws(()=> new Studentenhuis())
        assert.throws(()=> new Studentenhuis(''))
        assert.throws(()=> new Studentenhuis('', ''))
        done()
    })

    it('Should accept only two strings as arguments', (done) => {
        assert.throws(() => new Studentenhuis(1, 2))       // invalid: numbers
        assert.throws(() => new Studentenhuis({}, {}))     // invalid: objects
        assert.throws(() => new Studentenhuis([], []))     // invalid: arrays
        assert.throws(() => new Studentenhuis(true, true)) // invalid: booleans
        done()
    })

    it('Should be intitialized successfully when providing valid arguments', (done) => {
        const studentenhuis = new Studentenhuis('  abc  ', '  def  ')
        studentenhuis.should.have.property('naam')
        const naam = studentenhuis.naam
        naam.should.have.property('naam').equals('abc')
        naam.should.have.property('adres').equals('def')
        done()
    })
})