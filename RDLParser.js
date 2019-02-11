'use strict';

const cheerio = require('cheerio');
const fs = require('fs');

fs.readFile('PatientDemographicsChange.rdl', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    const $ = cheerio.load(data, { xmlMode: true });
    let params = getParameters($);
    console.log(params);
})



/**
 * get parameters
 * returns an Array of objects in the format of {name:'department, type: 'string'}
 * @param {*} $   the cheerio parsed document $.
 */
function getParameters($){
    const parameters = $('ReportParameters').children();
    let params = [];
    parameters.each((i, elm) => {
        //console.log( $(elm).attr('Name'));
        params.push({
            name: $(elm).attr('Name'),
            type: $('DataType', elm).text()
        })
    });
  return params;
}