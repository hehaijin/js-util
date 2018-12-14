const expect= require('chai').expect;
const {isUpperCase, isAlphaNumeric}= require('../string');

describe('isUpperCase',()=>{
    it('should be a function',()=>{
        expect(isUpperCase).to.be.a('function');
    } );
    it('test case 1', ()=>{
        const input='input';
        const output= isUpperCase(input);
        expect(output).to.be.equal(false);
    });

    it('test case 2', ()=>{
        const input='INPUT';
        const output= isUpperCase(input);
        expect(output).to.be.equal(true);
    });
    it('test case 3', ()=>{
        const input='122';
        const output= isUpperCase(input);
        expect(output).to.be.equal(false);
    });

} );

describe('isAlphaNumeric',()=>{
    it('should be a function',()=>{
        expect(isAlphaNumeric).to.be.a('function');
    } );
    it('test case 1', ()=>{
        const input='input';
        const output= isAlphaNumeric(input);
        expect(output).to.be.equal(true);
    });

    it('test case 1', ()=>{
        const input='in2put122';
        const output= isAlphaNumeric(input);
        expect(output).to.be.equal(true);
    });

    it('test case 1', ()=>{
        const input='3.5';
        const output= isAlphaNumeric(input);
        expect(output).to.be.equal(false);
    });

} );