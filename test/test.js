const expect= require('chai').expect;
const {getFrontEndName, queryForColumns,isUpperCase, isAlphaNumeric}= require('../lib');
describe('getFrontEndName',()=>{
    it('should be a function',()=>{
        expect(getFrontEndName).to.be.a('function');
    } );

    it('test case 1', ()=>{
        const name= 'TestID';
        const output= getFrontEndName(name);
        expect(output).to.be.equal('testId');
    });
    it('test case 2', ()=>{
        const name= 'testid';
        const output= getFrontEndName(name);
        expect(output).to.be.equal('testid');
    });
    it('test case 3', ()=>{
        const name= 'TESTid';
        const output= getFrontEndName(name);
        expect(output).to.be.equal('testId');
    });

    it('test case 4', ()=>{
        const name= 'PPOflag';
        const output= getFrontEndName(name);
        expect(output).to.be.equal('ppoFlag');
    });
} );



describe('queryForColumns',()=>{
    it('should be a function',()=>{
        expect(queryForColumns).to.be.a('function');
    } );
    it('test case 1', ()=>{
        const schema='admin';
        const name= 'Client';
        const output= queryForColumns(schema, name);
        expect(output).to.be.equal("select * from information_schema.columns where table_schema = 'admin' and table_name='Client'");
    });

} );

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