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