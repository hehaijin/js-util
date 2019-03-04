'use strict';


function R(str) {
    return new RegExp(str);
}


function concat(...inputs) {
    let str= inputs.map( item=> r(item)).join('');
    return new RegExp(str);
}

function or(...inputs) {
    let str= inputs.map( item=> r(item)).join('|');
    return new RegExp('\(' + str + '\)');
}


function r(regex) {
    let len = regex.toString().length;
    return regex.toString().substring(1, len - 1);
}


let re1= /\d+/;
let re2= /[a-z]+/;

var paragraph = 'The quick brown fox jumps over the lazy dog. It barked123';


console.log(paragraph.match(re1));
console.log(paragraph.match(re2));
console.log( paragraph.match(concat(re2,re1)));
console.log( paragraph.match(or(re1,re2))); 
